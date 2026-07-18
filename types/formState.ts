export interface FormState {
  error?: string;
  success?: boolean;
  // Mensagem opcional exibida no sucesso (ex.: resumo da venda com desconto).
  info?: string;
}

export const initialFormState: FormState = {};
