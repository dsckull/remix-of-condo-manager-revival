# Project Memory

## Core
Neomorphic light theme. Primary navy 225 38% 14%, accent gold 38 65% 48%, bg cool gray 220 20% 92%.
DM Sans body, JetBrains Mono code. Portuguese-BR UI.
Supabase Cloud backend. 13 tables + user_roles + profiles + condominios + subscriptions + votacoes_sindicancia with RLS.
Admin-only access on all tables via is_admin() function.
Neo shadow system: neo-raised, neo-inset, neo-pressed, neo-disc, neo-pill.
Google OAuth + email/password auth. Auto-confirm enabled.
Landing page at /landing, dashboard at /. AI assistant FAB in authenticated pages.

## Memories
- [Design tokens](mem://design/tokens) — Neomorphic light theme, gold accent, embossed text, hex clusters, concentric rings
- [Database schema](mem://features/schema) — 13 Conserje tables + profiles, condominios, subscriptions, votacoes_sindicancia
- [Auth flow](mem://features/auth) — Google OAuth + email/password, AuthGuard on all routes, user_roles table for admin access, profiles auto-created on signup
