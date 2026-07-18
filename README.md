# TN Club — Clube de Benefícios

App mobile-first (Next.js App Router + TypeScript + Tailwind) para o clube de fidelidade da TN Clean, com painel administrativo completo, conectado ao **Supabase** (PostgreSQL real).

Esta é a **sétima etapa**: existe uma landing de acesso em `/`, um login de cliente por CPF/telefone (`/cliente/login`) e um login administrativo real via **Supabase Auth** (`/admin/login`), que protege todo o painel (`/admin/*`) por middleware.

## Como configurar o Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com) (New Project).
2. No projeto, abra **SQL Editor** e rode o conteúdo de `supabase/schema.sql` (tabelas, índices, RLS, funções transacionais). `supabase/seed.sql` é opcional e está intencionalmente vazio — cadastre seus primeiros dados pelo próprio painel administrativo.
3. Em **Project Settings > API**, copie a **Project URL** e a chave **anon/public** (nunca a `service_role`) para `.env.local` (copie de `.env.local.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
   ```
4. Crie ao menos um usuário administrativo em **Authentication > Users > Add user** (e-mail + senha) — é com essas credenciais que você entra em `/admin/login`. Não há tela de cadastro de admin de propósito.
5. **Logo**: já está em `public/logo-tn-club.jpg`, referenciada pela landing page.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — essa é a landing de acesso.

## Páginas

- `/` — Landing de acesso (Sou Cliente / Sou Administrador)
- `/cliente/login` — Login do cliente por CPF ou telefone (sem senha)
- `/dashboard`, `/pontos`, `/historico`, `/beneficios`, `/perfil` — Área do cliente (exige login em `/cliente/login`)
- `/admin/login` — Login administrativo (Supabase Auth)
- `/admin/dashboard`, `/admin/clientes`, `/admin/servicos`, `/admin/pontuacao`, `/admin/beneficios`, `/admin/historico`, `/admin/configuracoes` — Painel administrativo (protegido por `middleware.ts`)

## Estrutura

- `app/` — rotas (App Router)
  - `(client)/` — landing + área do cliente, sob o mesmo layout "moldura de app" (`layout.tsx`)
  - `admin/login/` — login administrativo (fora da moldura do painel, pois é público)
  - `admin/(painel)/` — todo o painel administrativo, protegido pelo middleware
- `middleware.ts` — protege `/admin/*` (exceto `/admin/login`), redirecionando para o login quando não há sessão
- `components/ui/` — design system genérico (Button, Card, Table, Alert...)
- `components/shared/` — componentes de domínio do cliente (HistoryCard, RewardCard, ProfileCard, PointsCard, SemClienteState...)
- `components/admin/` — componentes do painel (formulários, PageHeader, StatCard...)
- `layout/` — Header, BottomNavigation, PageShell, AdminSidebar
- `services/` — regras de negócio + acesso a dados
  - `services/supabase.ts` — cliente para consultas de dados
  - `services/supabaseServer.ts` — cliente ciente de cookies, usado só para Auth (login administrativo)
  - `services/clienteService.ts` (`getClienteAtual`) — identifica o cliente pelo cookie `cliente_id`, definido em `/cliente/login`
- `supabase/` — `schema.sql` (tabelas, RLS, funções) e `seed.sql` (dados de demonstração, opcional)
- `types/` — contratos TypeScript do domínio
- `utils/` — helpers puros (formatação, cálculo de nível, constantes)

## Autenticação

- **Cliente**: identificação simples por CPF/telefone (sem senha), guardada em um cookie `httpOnly`. Não é uma sessão do Supabase Auth — é intencionalmente leve, já que o cliente final não gerencia senha.
- **Administrador**: autenticação real via Supabase Auth (e-mail + senha), com sessão gerenciada por `@supabase/ssr` e renovada a cada requisição pelo `middleware.ts`.

Próximos passos naturais: tela de logout no painel, recuperação de senha do admin, e (se necessário) trocar a identificação do cliente por um código de acesso enviado por SMS/e-mail em vez de CPF/telefone puro.
