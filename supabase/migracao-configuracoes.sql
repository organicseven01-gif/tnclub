-- =========================================================================
-- MIGRAÇÃO: tela de Configurações funcional (WhatsApp + níveis editáveis)
-- Rode este script UMA VEZ no SQL Editor do Supabase (projeto já existente).
-- É seguro rodar novamente: usa "if not exists" / "create or replace".
-- =========================================================================

-- 1) Tabela de configurações (linha única, id = 1)
create table if not exists public.configuracoes (
  id               smallint primary key default 1,
  whatsapp         text not null default '',
  limite_prata     integer not null default 500,
  limite_ouro      integer not null default 1500,
  limite_platina   integer not null default 3000,
  limite_diamante  integer not null default 6000,
  updated_at       timestamptz not null default now(),

  constraint configuracoes_singleton check (id = 1),
  constraint configuracoes_ordem_check check (
    limite_prata > 0
    and limite_prata < limite_ouro
    and limite_ouro < limite_platina
    and limite_platina < limite_diamante
  )
);

insert into public.configuracoes (id) values (1) on conflict (id) do nothing;

-- 2) RLS da nova tabela (permissiva, igual às demais nesta fase)
alter table public.configuracoes enable row level security;

drop policy if exists "temp_acesso_total_configuracoes" on public.configuracoes;
create policy "temp_acesso_total_configuracoes" on public.configuracoes
  for all using (true) with check (true);

-- 3) Cálculo de nível passa a ler os limites da tabela de configurações
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

-- 4) Função que salva as configurações e reclassifica todos os clientes
create or replace function public.salvar_configuracao(
  p_whatsapp text,
  p_limite_prata integer,
  p_limite_ouro integer,
  p_limite_platina integer,
  p_limite_diamante integer
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
     set whatsapp        = coalesce(p_whatsapp, ''),
         limite_prata    = p_limite_prata,
         limite_ouro     = p_limite_ouro,
         limite_platina  = p_limite_platina,
         limite_diamante = p_limite_diamante,
         updated_at      = now()
   where id = 1
   returning * into v_config;

  -- Só atualiza quem realmente muda de nível (e satisfaz a exigência do
  -- Supabase de ter uma cláusula WHERE em todo UPDATE).
  update public.clientes
     set nivel = public.fn_calcular_nivel(saldo_pontos)
   where nivel is distinct from public.fn_calcular_nivel(saldo_pontos);

  return v_config;
end;
$$;
