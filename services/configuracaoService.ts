import type { Configuracao, NivelFidelidade } from "@/types";
import { TIER_THRESHOLDS } from "@/utils/constants";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

interface ConfiguracaoRow {
  whatsapp: string;
  limite_prata: number;
  limite_ouro: number;
  limite_platina: number;
  limite_diamante: number;
}

// Valores padrão usados quando ainda não há configuração salva no banco.
const CONFIGURACAO_PADRAO: Configuracao = {
  whatsapp: "",
  limitePrata: TIER_THRESHOLDS.prata,
  limiteOuro: TIER_THRESHOLDS.ouro,
  limitePlatina: TIER_THRESHOLDS.platina,
  limiteDiamante: TIER_THRESHOLDS.diamante,
};

function mapConfiguracao(row: ConfiguracaoRow): Configuracao {
  return {
    whatsapp: row.whatsapp ?? "",
    limitePrata: row.limite_prata,
    limiteOuro: row.limite_ouro,
    limitePlatina: row.limite_platina,
    limiteDiamante: row.limite_diamante,
  };
}

export async function getConfiguracao(): Promise<Configuracao> {
  const { data, error } = await supabase.from("configuracoes").select("*").eq("id", 1).maybeSingle();

  // Leitura de configuração nunca deve derrubar a tela: se a tabela ainda não
  // existe (migração não rodada) ou houver qualquer falha, caímos nos padrões.
  if (error) {
    console.error(error);
    return CONFIGURACAO_PADRAO;
  }
  if (!data) return CONFIGURACAO_PADRAO;

  return mapConfiguracao(data as ConfiguracaoRow);
}

// Converte a configuração em um mapa de limites por nível (bronze é sempre 0),
// no mesmo formato de TIER_THRESHOLDS — pronto para as funções de utils/tier.
export function getLimitesNivel(config: Configuracao): Record<NivelFidelidade, number> {
  return {
    bronze: 0,
    prata: config.limitePrata,
    ouro: config.limiteOuro,
    platina: config.limitePlatina,
    diamante: config.limiteDiamante,
  };
}

// Salva a configuração e reclassifica todos os clientes com os novos limites,
// tudo em uma única transação no banco (função SQL salvar_configuracao).
export async function salvarConfiguracao(dados: Configuracao): Promise<void> {
  const { error } = await supabase.rpc("salvar_configuracao", {
    p_whatsapp: dados.whatsapp,
    p_limite_prata: dados.limitePrata,
    p_limite_ouro: dados.limiteOuro,
    p_limite_platina: dados.limitePlatina,
    p_limite_diamante: dados.limiteDiamante,
  });

  if (error) lancarErroAmigavel(error, "Não foi possível salvar as configurações.");
}
