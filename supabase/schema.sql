-- =========================================================================
-- TN Clean | Clube de Benefícios — Schema do banco de dados (Supabase/Postgres)
-- =========================================================================
-- Como usar: cole este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (app.supabase.com > seu projeto > SQL Editor > New query) e clique em Run.
-- Rode depois "seed.sql" para popular com os mesmos dados de demonstração
-- usados nas etapas anteriores do projeto.
--
-- Nomenclatura: colunas em snake_case (padrão Postgres). O mapeamento para
-- camelCase acontece na camada de services (TypeScript), nunca no banco.
-- =========================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- -------------------------------------------------------------------------
-- CLIENTES
-- -------------------------------------------------------------------------
create table if not exists public.clientes (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null,
  telefone       text not null,
  cpf            text not null,
  email          text not null,
  saldo_pontos   integer not null default 0,
  nivel          text not null default 'bronze',
  -- "status" não fazia parte do modelo original da Etapa 5, mas o painel
  -- administrativo (Etapa 3/4) já depende dele (tabela, filtro, indicador
  -- "Clientes ativos") — mantido para não alterar nenhuma tela existente.
  status         text not null default 'ativo',
  data_cadastro  date not null default current_date,
  created_at     timestamptz not null default now(),

  constraint clientes_email_key unique (email),
  constraint clientes_cpf_key unique (cpf),
  constraint clientes_saldo_pontos_check check (saldo_pontos >= 0),
  constraint clientes_nivel_check check (nivel in ('bronze', 'prata', 'ouro', 'platina', 'diamante')),
  constraint clientes_status_check check (status in ('ativo', 'inativo'))
);

create index if not exists idx_clientes_nome_trgm on public.clientes using gin (nome gin_trgm_ops);
create index if not exists idx_clientes_status on public.clientes (status);

comment on table public.clientes is 'Clientes do clube de fidelidade.';

-- -------------------------------------------------------------------------
-- SERVICOS
-- -------------------------------------------------------------------------
create table if not exists public.servicos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  valor       numeric(10, 2) not null,
  -- Coluna mantida por compatibilidade; os pontos passaram a ser calculados
  -- automaticamente pelo valor do serviço (ver registrar_atendimento).
  pontos      integer not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),

  constraint servicos_valor_check check (valor > 0),
  constraint servicos_pontos_check check (pontos >= 0)
);

create index if not exists idx_servicos_ativo on public.servicos (ativo);

comment on table public.servicos is 'Catálogo de serviços de higienização oferecidos.';

-- -------------------------------------------------------------------------
-- ATENDIMENTOS (histórico de serviços realizados)
-- -------------------------------------------------------------------------
create table if not exists public.atendimentos (
  id               uuid primary key default gen_random_uuid(),
  cliente_id       uuid not null references public.clientes (id) on delete restrict,
  servico_id       uuid not null references public.servicos (id) on delete restrict,
  quantidade       integer not null default 1,
  valor_total      numeric(10, 2) not null,
  pontos_gerados   integer not null,
  observacao       text not null default '',
  data_atendimento date not null default current_date,
  created_at       timestamptz not null default now(),

  constraint atendimentos_quantidade_check check (quantidade > 0),
  constraint atendimentos_valor_total_check check (valor_total >= 0),
  constraint atendimentos_pontos_gerados_check check (pontos_gerados >= 0)
);

create index if not exists idx_atendimentos_cliente_id on public.atendimentos (cliente_id);
create index if not exists idx_atendimentos_servico_id on public.atendimentos (servico_id);
create index if not exists idx_atendimentos_data on public.atendimentos (data_atendimento desc);

comment on table public.atendimentos is 'Serviços já realizados para cada cliente (histórico).';

-- -------------------------------------------------------------------------
-- BENEFICIOS
-- -------------------------------------------------------------------------
create table if not exists public.beneficios (
  id                 uuid primary key default gen_random_uuid(),
  nome               text not null,
  descricao          text not null default '',
  pontos_necessarios integer not null,
  -- "imagem_url" não fazia parte do modelo original da Etapa 5, mas o
  -- formulário de benefícios do painel (Etapa 3) já possui este campo.
  imagem_url         text,
  ativo              boolean not null default true,
  created_at         timestamptz not null default now(),

  constraint beneficios_pontos_necessarios_check check (pontos_necessarios > 0)
);

create index if not exists idx_beneficios_ativo on public.beneficios (ativo);

comment on table public.beneficios is 'Catálogo de benefícios resgatáveis por pontos.';

-- -------------------------------------------------------------------------
-- RESGATES
-- -------------------------------------------------------------------------
create table if not exists public.resgates (
  id                 uuid primary key default gen_random_uuid(),
  cliente_id         uuid not null references public.clientes (id) on delete restrict,
  beneficio_id       uuid not null references public.beneficios (id) on delete restrict,
  pontos_utilizados  integer not null,
  status             text not null default 'concluido',
  created_at         timestamptz not null default now(),

  constraint resgates_pontos_utilizados_check check (pontos_utilizados > 0),
  constraint resgates_status_check check (status in ('concluido', 'cancelado'))
);

create index if not exists idx_resgates_cliente_id on public.resgates (cliente_id);
create index if not exists idx_resgates_beneficio_id on public.resgates (beneficio_id);

comment on table public.resgates is 'Resgates de benefícios feitos pelos clientes.';

-- -------------------------------------------------------------------------
-- CONFIGURAÇÕES (linha única, editada pelo administrador)
-- -------------------------------------------------------------------------
create table if not exists public.configuracoes (
  id                       smallint primary key default 1,
  whatsapp                 text not null default '',
  limite_prata             integer not null default 500,
  limite_ouro              integer not null default 1500,
  limite_platina           integer not null default 3000,
  limite_diamante          integer not null default 6000,
  reais_por_ponto          numeric(10,2) not null default 3.00,
  pontos_por_real_desconto integer not null default 3,
  validade_pontos_ativa    boolean not null default true,
  validade_pontos_dias     integer not null default 365,
  updated_at               timestamptz not null default now(),

  constraint configuracoes_singleton check (id = 1),
  constraint configuracoes_ordem_check check (
    limite_prata > 0
    and limite_prata < limite_ouro
    and limite_ouro < limite_platina
    and limite_platina < limite_diamante
  )
);

insert into public.configuracoes (id) values (1) on conflict (id) do nothing;

comment on table public.configuracoes is 'Configurações gerais do clube (linha única, id = 1).';

-- -------------------------------------------------------------------------
-- LOTES DE PONTOS (cada acúmulo vira um lote com validade própria)
-- -------------------------------------------------------------------------
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

comment on table public.pontos_lotes is 'Lotes de pontos gerados por atendimento, com validade individual (FIFO).';

-- =========================================================================
-- FUNÇÕES DE NEGÓCIO (executadas no banco para garantir atomicidade)
-- =========================================================================

-- Saldo disponível = soma dos lotes ainda não vencidos.
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

-- Recalcula o saldo (cache) e o nível do cliente a partir dos lotes válidos.
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

-- Consome N pontos via FIFO (vencimento mais próximo primeiro).
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

-- Calcula o nível de fidelidade a partir do saldo de pontos, usando os limites
-- configurados pelo administrador (tabela public.configuracoes). É "stable"
-- (não "immutable") porque lê de uma tabela.
create or replace function public.fn_calcular_nivel(p_saldo integer)
returns text
language sql
stable
as $$
  select case
    when p_saldo >= c.limite_diamante then 'diamante'
    when p_saldo >= c.limite_platina  then 'platina'
    when p_saldo >= c.limite_ouro     then 'ouro'
    when p_saldo >= c.limite_prata    then 'prata'
    else 'bronze'
  end
  from public.configuracoes c
  where c.id = 1;
$$;

-- Registra um atendimento: calcula os pontos automaticamente pelo valor do
-- serviço (config.reais_por_ponto), cria um lote de pontos com validade e
-- recalcula saldo/nível — tudo em uma única transação.
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
  v_valor_total numeric(10, 2);
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

-- Resgata um benefício: verifica saldo, desconta pontos, atualiza nível e
-- grava o resgate — tudo em uma única transação com trava de linha
-- (FOR UPDATE) para evitar condição de corrida em resgates simultâneos.
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

-- Salva as configurações (WhatsApp, limites dos níveis e regras do programa de
-- pontos) e reclassifica todos os clientes — tudo em uma única transação.
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

  -- Reclassifica os clientes cujo nível muda com os novos limites (o WHERE
  -- também atende à exigência do Supabase de não permitir UPDATE sem cláusula).
  update public.clientes c
     set nivel = public.fn_calcular_nivel(public.saldo_pontos_disponivel(c.id))
   where c.nivel is distinct from public.fn_calcular_nivel(public.saldo_pontos_disponivel(c.id));

  return v_config;
end;
$$;

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
-- RLS habilitado em todas as tabelas. Como a Etapa 6 (autenticação) ainda
-- não existe, as políticas abaixo são deliberadamente permissivas — todo
-- acesso (leitura e escrita) é liberado para o cliente fixo de testes.
-- Quando o login for implementado, substitua estas políticas por versões
-- que verifiquem auth.uid() (exemplos comentados ao final do arquivo).

alter table public.clientes    enable row level security;
alter table public.servicos    enable row level security;
alter table public.atendimentos enable row level security;
alter table public.beneficios  enable row level security;
alter table public.resgates    enable row level security;
alter table public.configuracoes enable row level security;
alter table public.pontos_lotes enable row level security;

create policy "temp_acesso_total_clientes" on public.clientes
  for all using (true) with check (true);

create policy "temp_acesso_total_servicos" on public.servicos
  for all using (true) with check (true);

create policy "temp_acesso_total_atendimentos" on public.atendimentos
  for all using (true) with check (true);

create policy "temp_acesso_total_beneficios" on public.beneficios
  for all using (true) with check (true);

create policy "temp_acesso_total_resgates" on public.resgates
  for all using (true) with check (true);

create policy "temp_acesso_total_configuracoes" on public.configuracoes
  for all using (true) with check (true);

create policy "temp_acesso_total_pontos_lotes" on public.pontos_lotes
  for all using (true) with check (true);

-- Exemplo do que as políticas da Etapa 6 devem fazer (não executar ainda):
--
-- drop policy "temp_acesso_total_clientes" on public.clientes;
-- create policy "clientes_select_proprio" on public.clientes
--   for select using (auth.uid() = id);
-- create policy "clientes_update_proprio" on public.clientes
--   for update using (auth.uid() = id) with check (auth.uid() = id);
-- (o painel administrativo precisará de uma policy adicional baseada em
--  uma tabela/claim de "admin", já que ele opera sobre todos os clientes)
