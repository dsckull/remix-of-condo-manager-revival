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

- **Dashboard** (`/`) - KPI cards and operational flow charts
- **Moradores** (`/moradores`) - Resident management
- **Encomendas** (`/encomendas`) - Package/delivery management
- **Visitantes** (`/visitantes`) - Visitor access control
- **Ocorrências** (`/ocorrencias`) - Incident reports
- **Financeiro** (`/financeiro`) - Financial management
- **Assembleias** (`/assembleias`) - Assembly meetings
- **Reservas** (`/reservas`) - Common area reservations
- **Jurídico** (`/juridico`) - Legal documents
- **DefCom** (`/defcom`) - Security alerts
- **Votação** (`/votacao`) - Voting/polls

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
