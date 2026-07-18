-- =========================================================================
-- MIGRAÇÃO: Venda com desconto em pontos (Etapa 2)
-- Registra os serviços, acumula pontos novos e consome o desconto (FIFO)
-- em uma única transação. Rode UMA VEZ no SQL Editor do Supabase.
-- =========================================================================

-- Registro de descontos concedidos com pontos (histórico/auditoria)
create table if not exists public.descontos_pontos (
  id                uuid primary key default gen_random_uuid(),
  cliente_id        uuid not null references public.clientes (id) on delete cascade,
  pontos_utilizados integer not null,
  desconto_reais    numeric(10,2) not null,
  created_at        timestamptz not null default now(),
  constraint descontos_pontos_check check (pontos_utilizados > 0 and desconto_reais > 0)
);

create index if not exists idx_descontos_pontos_cliente on public.descontos_pontos (cliente_id);

alter table public.descontos_pontos enable row level security;
drop policy if exists "temp_acesso_total_descontos_pontos" on public.descontos_pontos;
create policy "temp_acesso_total_descontos_pontos" on public.descontos_pontos
  for all using (true) with check (true);

-- Registra uma venda: cada item vira um atendimento (com acúmulo de pontos em
-- lote) e, se houver desconto, os pontos são consumidos via FIFO — tudo atômico.
-- p_itens: jsonb [{"servicoId": "...", "quantidade": 2}, ...]
-- p_desconto_reais: desconto em reais inteiros que o cliente quer usar (0 = nenhum)
create or replace function public.registrar_venda(
  p_cliente_id uuid,
  p_itens jsonb,
  p_observacao text,
  p_desconto_reais integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_config          public.configuracoes%rowtype;
  v_item            jsonb;
  v_servico         public.servicos%rowtype;
  v_qtd             integer;
  v_valor_item      numeric(10,2);
  v_valor_total     numeric(10,2) := 0;
  v_pontos_item     integer;
  v_pontos_gerados  integer := 0;
  v_vencimento      date;
  v_atend_id        uuid;
  v_desconto        integer := greatest(coalesce(p_desconto_reais, 0), 0);
  v_pontos_desconto integer := 0;
  v_saldo           integer;
begin
  if not exists (select 1 from public.clientes where id = p_cliente_id) then
    raise exception 'Cliente não encontrado.';
  end if;

  select * into v_config from public.configuracoes where id = 1;

  -- Valida o desconto pedido contra o saldo disponível ANTES da venda
  -- (assim o desconto usa apenas pontos que o cliente já tinha).
  v_saldo := public.saldo_pontos_disponivel(p_cliente_id);
  if v_desconto > 0 then
    v_pontos_desconto := v_desconto * v_config.pontos_por_real_desconto;
    if v_pontos_desconto > v_saldo then
      raise exception 'Pontos insuficientes para o desconto solicitado.';
    end if;
  end if;

  if v_config.validade_pontos_ativa then
    v_vencimento := current_date + (v_config.validade_pontos_dias || ' days')::interval;
  else
    v_vencimento := null;
  end if;

  -- Registra cada serviço e acumula os pontos novos (por item).
  for v_item in select * from jsonb_array_elements(p_itens)
  loop
    v_qtd := coalesce((v_item->>'quantidade')::integer, 0);
    if v_qtd <= 0 then
      continue;
    end if;

    select * into v_servico from public.servicos where id = (v_item->>'servicoId')::uuid;
    if not found then
      raise exception 'Serviço não encontrado.';
    end if;

    v_valor_item := v_servico.valor * v_qtd;
    v_valor_total := v_valor_total + v_valor_item;
    v_pontos_item := floor(v_valor_item / nullif(v_config.reais_por_ponto, 0))::integer;
    if v_pontos_item is null then
      v_pontos_item := 0;
    end if;

    insert into public.atendimentos
      (cliente_id, servico_id, quantidade, valor_total, pontos_gerados, observacao, data_atendimento)
    values
      (p_cliente_id, v_servico.id, v_qtd, v_valor_item, v_pontos_item, coalesce(p_observacao, ''), current_date)
    returning id into v_atend_id;

    if v_pontos_item > 0 then
      insert into public.pontos_lotes
        (cliente_id, atendimento_id, pontos, pontos_restantes, data_geracao, data_vencimento)
      values
        (p_cliente_id, v_atend_id, v_pontos_item, v_pontos_item, current_date, v_vencimento);
      v_pontos_gerados := v_pontos_gerados + v_pontos_item;
    end if;
  end loop;

  if v_valor_total <= 0 then
    raise exception 'Adicione ao menos um serviço.';
  end if;

  -- O desconto nunca pode passar do valor total (consome só o necessário).
  if v_desconto > v_valor_total then
    v_desconto := floor(v_valor_total)::integer;
    v_pontos_desconto := v_desconto * v_config.pontos_por_real_desconto;
  end if;

  -- Consome os pontos do desconto (FIFO) e registra o desconto.
  if v_pontos_desconto > 0 then
    perform public.consumir_pontos_fifo(p_cliente_id, v_pontos_desconto);
    insert into public.descontos_pontos (cliente_id, pontos_utilizados, desconto_reais)
    values (p_cliente_id, v_pontos_desconto, v_desconto);
  end if;

  perform public.atualizar_saldo_cliente(p_cliente_id);

  return jsonb_build_object(
    'valor_total', v_valor_total,
    'desconto_reais', v_desconto,
    'pontos_utilizados', v_pontos_desconto,
    'valor_pagar', v_valor_total - v_desconto,
    'pontos_gerados', v_pontos_gerados
  );
end;
$$;
