-- =========================================================================
-- MIGRAÇÃO: Programa de Pontos
-- Acúmulo automático pelo valor do serviço + validade por lote + consumo FIFO.
-- Rode UMA VEZ no SQL Editor do Supabase (projeto já existente).
-- Seguro re-rodar: usa "if not exists" / "create or replace".
-- =========================================================================

-- 1) Novas configurações do programa de pontos
alter table public.configuracoes
  add column if not exists reais_por_ponto          numeric(10,2) not null default 3.00,
  add column if not exists pontos_por_real_desconto integer       not null default 3,
  add column if not exists validade_pontos_ativa    boolean       not null default true,
  add column if not exists validade_pontos_dias     integer       not null default 365;

-- 2) Serviço passa a ter só o valor (pontos deixa de ser obrigatório)
alter table public.servicos alter column pontos set default 0;

-- 3) Lotes de pontos: cada acúmulo vira um lote com validade própria
create table if not exists public.pontos_lotes (
  id                uuid primary key default gen_random_uuid(),
  cliente_id        uuid not null references public.clientes (id) on delete cascade,
  atendimento_id    uuid references public.atendimentos (id) on delete set null,
  pontos            integer not null,
  pontos_restantes  integer not null,
  data_geracao      date not null default current_date,
  data_vencimento   date,
  created_at        timestamptz not null default now(),
  constraint pontos_lotes_pontos_check check (pontos > 0),
  constraint pontos_lotes_restantes_check check (pontos_restantes >= 0 and pontos_restantes <= pontos)
);

create index if not exists idx_pontos_lotes_cliente on public.pontos_lotes (cliente_id);
create index if not exists idx_pontos_lotes_fifo on public.pontos_lotes (cliente_id, data_vencimento);

alter table public.pontos_lotes enable row level security;
drop policy if exists "temp_acesso_total_pontos_lotes" on public.pontos_lotes;
create policy "temp_acesso_total_pontos_lotes" on public.pontos_lotes
  for all using (true) with check (true);

-- 4) Saldo disponível = soma dos lotes ainda não vencidos
create or replace function public.saldo_pontos_disponivel(p_cliente_id uuid)
returns integer
language sql
stable
as $$
  select coalesce(sum(pontos_restantes), 0)::integer
  from public.pontos_lotes
  where cliente_id = p_cliente_id
    and pontos_restantes > 0
    and (data_vencimento is null or data_vencimento >= current_date);
$$;

-- 5) Recalcula o saldo (cache) e o nível do cliente a partir dos lotes válidos
create or replace function public.atualizar_saldo_cliente(p_cliente_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_saldo integer;
begin
  v_saldo := public.saldo_pontos_disponivel(p_cliente_id);
  update public.clientes
     set saldo_pontos = v_saldo,
         nivel = public.fn_calcular_nivel(v_saldo)
   where id = p_cliente_id;
end;
$$;

-- 6) Consome N pontos via FIFO (vencimento mais próximo primeiro)
create or replace function public.consumir_pontos_fifo(p_cliente_id uuid, p_quantidade integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restante integer := p_quantidade;
  v_lote     record;
  v_usar     integer;
begin
  if p_quantidade is null or p_quantidade <= 0 then
    return;
  end if;

  for v_lote in
    select id, pontos_restantes
      from public.pontos_lotes
     where cliente_id = p_cliente_id
       and pontos_restantes > 0
       and (data_vencimento is null or data_vencimento >= current_date)
     order by data_vencimento asc nulls last, data_geracao asc
     for update
  loop
    exit when v_restante <= 0;
    v_usar := least(v_lote.pontos_restantes, v_restante);
    update public.pontos_lotes
       set pontos_restantes = pontos_restantes - v_usar
     where id = v_lote.id;
    v_restante := v_restante - v_usar;
  end loop;

  if v_restante > 0 then
    raise exception 'Saldo de pontos insuficiente.';
  end if;
end;
$$;

-- 7) Registrar atendimento: acúmulo automático pelo valor + lote com validade
create or replace function public.registrar_atendimento(
  p_cliente_id uuid,
  p_servico_id uuid,
  p_quantidade integer,
  p_observacao text default ''
)
returns public.atendimentos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_servico     public.servicos%rowtype;
  v_config      public.configuracoes%rowtype;
  v_valor_total numeric(10,2);
  v_pontos      integer;
  v_vencimento  date;
  v_atend       public.atendimentos%rowtype;
begin
  if p_quantidade is null or p_quantidade <= 0 then
    raise exception 'A quantidade deve ser maior que zero.';
  end if;

  if not exists (select 1 from public.clientes where id = p_cliente_id) then
    raise exception 'Cliente não encontrado.';
  end if;

  select * into v_servico from public.servicos where id = p_servico_id;
  if not found then
    raise exception 'Serviço não encontrado.';
  end if;

  select * into v_config from public.configuracoes where id = 1;

  v_valor_total := v_servico.valor * p_quantidade;
  -- pontos = valor gasto ÷ reais por ponto (parte inteira)
  v_pontos := floor(v_valor_total / nullif(v_config.reais_por_ponto, 0))::integer;
  if v_pontos is null then
    v_pontos := 0;
  end if;

  if v_config.validade_pontos_ativa then
    v_vencimento := current_date + (v_config.validade_pontos_dias || ' days')::interval;
  else
    v_vencimento := null;
  end if;

  insert into public.atendimentos
    (cliente_id, servico_id, quantidade, valor_total, pontos_gerados, observacao, data_atendimento)
  values
    (p_cliente_id, p_servico_id, p_quantidade, v_valor_total, v_pontos, coalesce(p_observacao, ''), current_date)
  returning * into v_atend;

  if v_pontos > 0 then
    insert into public.pontos_lotes
      (cliente_id, atendimento_id, pontos, pontos_restantes, data_geracao, data_vencimento)
    values
      (p_cliente_id, v_atend.id, v_pontos, v_pontos, current_date, v_vencimento);
  end if;

  perform public.atualizar_saldo_cliente(p_cliente_id);
  return v_atend;
end;
$$;

-- 8) Resgatar benefício: agora consome pontos via FIFO
create or replace function public.resgatar_beneficio(
  p_cliente_id uuid,
  p_beneficio_id uuid
)
returns public.resgates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_beneficio    public.beneficios%rowtype;
  v_novo_resgate public.resgates%rowtype;
begin
  if not exists (select 1 from public.clientes where id = p_cliente_id) then
    raise exception 'Cliente não encontrado.';
  end if;

  select * into v_beneficio from public.beneficios where id = p_beneficio_id;
  if not found or not v_beneficio.ativo then
    raise exception 'Este benefício não está mais disponível.';
  end if;

  if public.saldo_pontos_disponivel(p_cliente_id) < v_beneficio.pontos_necessarios then
    raise exception 'Saldo insuficiente para resgatar este benefício.';
  end if;

  insert into public.resgates (cliente_id, beneficio_id, pontos_utilizados, status)
  values (p_cliente_id, p_beneficio_id, v_beneficio.pontos_necessarios, 'concluido')
  returning * into v_novo_resgate;

  perform public.consumir_pontos_fifo(p_cliente_id, v_beneficio.pontos_necessarios);
  perform public.atualizar_saldo_cliente(p_cliente_id);

  return v_novo_resgate;
end;
$$;

-- 9) Salvar configuração: inclui as novas regras do programa de pontos
drop function if exists public.salvar_configuracao(text, integer, integer, integer, integer);

create or replace function public.salvar_configuracao(
  p_whatsapp text,
  p_limite_prata integer,
  p_limite_ouro integer,
  p_limite_platina integer,
  p_limite_diamante integer,
  p_reais_por_ponto numeric,
  p_pontos_por_real_desconto integer,
  p_validade_pontos_ativa boolean,
  p_validade_pontos_dias integer
)
returns public.configuracoes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_config public.configuracoes%rowtype;
begin
  update public.configuracoes
     set whatsapp                 = coalesce(p_whatsapp, ''),
         limite_prata             = p_limite_prata,
         limite_ouro              = p_limite_ouro,
         limite_platina           = p_limite_platina,
         limite_diamante          = p_limite_diamante,
         reais_por_ponto          = p_reais_por_ponto,
         pontos_por_real_desconto = p_pontos_por_real_desconto,
         validade_pontos_ativa    = p_validade_pontos_ativa,
         validade_pontos_dias     = p_validade_pontos_dias,
         updated_at               = now()
   where id = 1
   returning * into v_config;

  -- Reclassifica os clientes cujo nível muda com os novos limites.
  update public.clientes c
     set nivel = public.fn_calcular_nivel(public.saldo_pontos_disponivel(c.id))
   where c.nivel is distinct from public.fn_calcular_nivel(public.saldo_pontos_disponivel(c.id));

  return v_config;
end;
$$;
