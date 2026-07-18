export function gerarId(prefixo?: string): string {
  const uuid = crypto.randomUUID();
  return prefixo ? `${prefixo}_${uuid}` : uuid;
}
