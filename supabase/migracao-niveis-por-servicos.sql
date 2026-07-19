-- =========================================================================
-- MIGRAÇÃO: Níveis por quantidade de serviços (em vez de pontos)
-- Bronze: 1-2 serviços | Prata: 3 | Ouro: 4 | Diamante: 5 ou mais
-- Remove o nível "Platina". Rode UMA VEZ no SQL Editor do Supabase.
-- =========================================================================

-- 1) Move quem estiver em 'platina' (nível removido) para 'ouro'
update public.clientes set nivel = 'ouro' where nivel = 'platina';

-- 2) Constraint de nível sem 'platina'
alter table public.clientes drop constraint if exists clientes_nivel_check;
alter table public.clientes add constraint clientes_nivel_check
  check (nivel in ('bronze', 'prata', 'ouro', 'diamante'));

-- 3) Configurações: os limites passam a ser QUANTIDADE DE SERVIÇOS
alter table public.configuracoes drop constraint if exists configuracoes_ordem_check;
alter table public.configuracoes drop column if exists limite_platina;
alter table public.configuracoes add constraint configuracoes_ordem_check
  check (limite_prata > 0 and limite_prata < limite_ouro and limite_ouro < limite_diamante);

update public.configuracoes
   set limite_prata = 3, limite_ouro = 4, limite_diamante = 5
 where id = 1;

-- 4) Nível calculado pela quantidade de atendimentos (serviços) do cliente
create or replace function public.fn_nivel_por_servicos(p_cliente_id uuid)
returns text
language sql
stable
as $$
  select case
    when t.qtd >= c.limite_diamante then 'diamante'
    when t.qtd >= c.limite_ouro     then 'ouro'
    when t.qtd >= c.limite_prata    then 'prata'
    else 'bronze'
  end
  from public.configuracoes c
  cross join (
    select count(*)::integer as qtd
      from public.atendimentos
     where cliente_id = p_cliente_id
  ) t
  where c.id = 1;
$$;

-- 5) Saldo continua vindo dos lotes; o nível passa a vir dos serviços
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
         nivel = public.fn_nivel_por_servicos(p_cliente_id)
   where id = p_cliente_id;
end;
$$;

-- 6) salvar_configuracao sem o parâmetro de platina
drop function if exists public.salvar_configuracao(text, integer, integer, integer, integer, numeric, integer, boolean, integer);

create or replace function public.salvar_configuracao(
  p_whatsapp text,
  p_limite_prata integer,
  p_limite_ouro integer,
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
         limite_diamante          = p_limite_diamante,
         reais_por_ponto          = p_reais_por_ponto,
         pontos_por_real_desconto = p_pontos_por_real_desconto,
         validade_pontos_ativa    = p_validade_pontos_ativa,
         validade_pontos_dias     = p_validade_pontos_dias,
         updated_at               = now()
   where id = 1
   returning * into v_config;

  update public.clientes c
     set nivel = public.fn_nivel_por_servicos(c.id)
   where c.nivel is distinct from public.fn_nivel_por_servicos(c.id);

  return v_config;
end;
$$;

-- 7) Remove a função antiga (nível por pontos)
drop function if exists public.fn_calcular_nivel(integer);

-- 8) Recalcula o nível de todos os clientes com a nova regra
update public.clientes c
   set nivel = public.fn_nivel_por_servicos(c.id)
 where c.nivel is distinct from public.fn_nivel_por_servicos(c.id);
