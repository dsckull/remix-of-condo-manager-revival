# Project Memory

## Core
Neomorphic light theme. Primary navy 225 38% 14%, accent gold 38 65% 48%, bg cool gray 220 20% 92%.
DM Sans body, JetBrains Mono code. Portuguese-BR UI.
Supabase Cloud backend. 13 tables + user_roles with RLS.
Admin-only access on all tables via is_admin() function.
Neo shadow system: neo-raised, neo-inset, neo-pressed, neo-disc, neo-pill.

## Memories
- [Design tokens](mem://design/tokens) — Neomorphic light theme, gold accent, embossed text, hex clusters, concentric rings
- [Database schema](mem://features/schema) — 13 Conserje tables: moradores, encomendas, visitantes, ocorrencias, financeiro, assembleias, votacoes, areas_comuns, reservas, documentos_juridicos, notificacoes_juridicas, alertas_defcom, logs_interacao
- [Auth flow](mem://features/auth) — Email/password via Supabase Auth, AuthGuard on all routes, user_roles table for admin access
