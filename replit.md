# Conserje - Gestão Condominial

A condominium management system built with React, Vite, TypeScript, and Supabase.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite (port 5000)
- **Styling**: Tailwind CSS with a custom neumorphic/neo-brutalism design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM v6
- **Data Fetching**: TanStack React Query
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Animations**: Framer Motion

## Project Structure

```
src/
  components/       # Shared UI components
    neo/            # Custom neumorphic design system components
    ui/             # shadcn/ui components
  hooks/            # Custom React hooks (useAuth, use-toast, etc.)
  integrations/
    supabase/       # Supabase client and auto-generated TypeScript types
  pages/            # Route-level page components
  lib/              # Utility functions
```

## Key Features / Pages

All pages below have full read + write (CRUD) support:

- **Dashboard** (`/`) - KPI cards + real operational flow chart (visitantes + encomendas últimos 7 dias)
- **Moradores** (`/moradores`) - Cadastro de moradores (listar + cadastrar novo)
- **Encomendas** (`/encomendas`) - Gestão de pacotes (listar, registrar nova, atualizar status: notificado → retirado)
- **Visitantes** (`/visitantes`) - Controle de acesso (registrar entrada com modal, registrar saída inline)
- **Ocorrências** (`/ocorrencias`) - Registro e acompanhamento (criar, atualizar status: em_andamento → fechada)
- **Financeiro** (`/financeiro`) - Fluxo de caixa (KPIs, lista de lançamentos, registrar novos)
- **Assembleias** (`/assembleias`) - Assembleias (agendar, marcar realizada)
- **Reservas** (`/reservas`) - Calendário semanal de áreas comuns (leitura)
- **Jurídico** (`/juridico`) - Documentos + notificações jurídicas (leitura)
- **DefCom** (`/defcom`) - Alertas de segurança (leitura + resolver/arquivar, polling 15s)
- **Votação** (`/votacao`) - CRUD completo via `votacoes_sindicancia` (criar, abrir, encerrar, excluir)

## Authentication

Uses Supabase Auth with email/password and Google OAuth. The `useAuth` hook manages auth state via `AuthProvider` in `src/hooks/useAuth.tsx`.

## Environment Variables

Required environment variables (already set in `.env`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Production build
```

## Database

The Supabase database schema includes 13 main tables plus auth/roles:
`moradores`, `encomendas`, `visitantes`, `ocorrencias`, `financeiro`,
`assembleias`, `votacoes`, `areas_comuns`, `reservas`, `documentos_juridicos`,
`notificacoes_juridicas`, `alertas_defcom`, `logs_interacao`, `user_roles`,
`profiles`, `condominios`, `subscriptions`, `votacoes_sindicancia`

Full schema is in `supabase/migrations/`.
