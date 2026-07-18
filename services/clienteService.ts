import { cookies } from "next/headers";
import type { Cliente, NivelFidelidade, StatusCliente } from "@/types";
import { supabase } from "./supabase";
import { lancarErroAmigavel } from "./supabaseErrors";

export const COOKIE_CLIENTE_ID = "cliente_id";

interface ClienteRow {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  saldo_pontos: number;
  nivel: NivelFidelidade;
  status: StatusCliente;
  data_cadastro: string;
}

function mapCliente(row: ClienteRow): Cliente {
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    cpf: row.cpf,
    email: row.email,
    saldoPontos: row.saldo_pontos,
    nivel: row.nivel,
    status: row.status,
    dataCadastro: row.data_cadastro,
  };
}

// Identifica o cliente "logado" pelo cookie definido em /cliente/login (sem
// senha — apenas confirma que o CPF/telefone existe na base). Sem cookie,
// não há cliente identificado.
export async function getClienteAtual(): Promise<Cliente | null> {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get(COOKIE_CLIENTE_ID)?.value;

  if (!clienteId) return null;

  return (await buscarClientePorId(clienteId)) ?? null;
}

function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

// Usado pela tela /cliente/login: localiza o cliente pelo CPF ou telefone
// (comparando apenas os dígitos, já que o banco guarda os valores formatados).
export async function buscarClientePorCpfOuTelefone(termo: string): Promise<Cliente | null> {
  const digitos = apenasDigitos(termo);

  if (!digitos) return null;

  const { data, error } = await supabase.from("clientes").select("*");
  if (error) lancarErroAmigavel(error, "Não foi possível consultar seus dados.");

  const encontrado = (data ?? []).find(
    (row) => apenasDigitos(row.cpf) === digitos || apenasDigitos(row.telefone) === digitos
  );

  return encontrado ? mapCliente(encontrado) : null;
}

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase.from("clientes").select("*").order("nome");
  if (error) lancarErroAmigavel(error, "Não foi possível carregar os clientes.");
  return (data ?? []).map(mapCliente);
}

export interface FiltroClientes {
  busca?: string;
}

export async function listarClientes(filtro?: FiltroClientes): Promise<Cliente[]> {
  let query = supabase.from("clientes").select("*").order("nome");

  if (filtro?.busca) {
    const termo = filtro.busca.replace(/[,()%]/g, " ").trim();
    if (termo) {
      query = query.or(`nome.ilike.%${termo}%,telefone.ilike.%${termo}%,cpf.ilike.%${termo}%`);
    }
  }

  const { data, error } = await query;
  if (error) lancarErroAmigavel(error, "Não foi possível carregar os clientes.");
  return (data ?? []).map(mapCliente);
}

export async function buscarClientePorId(id: string): Promise<Cliente | undefined> {
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).maybeSingle();
  if (error) lancarErroAmigavel(error, "Não foi possível carregar o cliente.");
  return data ? mapCliente(data) : undefined;
}

export interface DadosNovoCliente {
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  status: StatusCliente;
}

export interface DadosAtualizarCliente {
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  nivel: NivelFidelidade;
  status: StatusCliente;
  saldoPontos: number;
}

// nivel, saldo_pontos e data_cadastro não são enviados na criação: o banco
// já garante os valores iniciais (bronze / 0 / hoje) via DEFAULT das colunas.
export async function criarCliente(dados: DadosNovoCliente): Promise<Cliente> {
  const { data, error } = await supabase
    .from("clientes")
    .insert({
      nome: dados.nome,
      telefone: dados.telefone,
      cpf: dados.cpf,
      email: dados.email,
      status: dados.status,
    })
    .select()
    .single();

  if (error) lancarErroAmigavel(error, "Não foi possível cadastrar o cliente.");
  return mapCliente(data);
}

export async function atualizarCliente(id: string, dados: DadosAtualizarCliente): Promise<Cliente> {
  const { data, error } = await supabase
    .from("clientes")
    .update({
      nome: dados.nome,
      telefone: dados.telefone,
      cpf: dados.cpf,
      email: dados.email,
      nivel: dados.nivel,
      status: dados.status,
      saldo_pontos: dados.saldoPontos,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) lancarErroAmigavel(error, "Não foi possível atualizar o cliente.");
  return mapCliente(data);
}
