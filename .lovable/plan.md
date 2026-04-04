

# Plano: Conserje no Lovable com Supabase Cloud

## Resumo

Recriar o sistema Conserje completo dentro do Lovable: 13 tabelas no Supabase Cloud (com RLS), 10 páginas frontend com o design industrial/dark do original, conectadas via Supabase client direto (sem API server intermediário).

## O que muda em relação ao original

O projeto original usava uma arquitetura monorepo com Express + Drizzle + API REST. Aqui no Lovable, substituímos tudo por:
- **Supabase Cloud** no lugar do Express/Drizzle (banco PostgreSQL gerenciado, com RLS)
- **Supabase JS client** no lugar dos hooks `@workspace/api-client-react` (chamadas diretas ao banco)
- **React Router** no lugar do Wouter (padrão Lovable)
- O **design visual** (tema dark industrial, Chakra Petch + DM Sans, cores, layout) será preservado fielmente

## Fase 1 -- Banco de dados (Supabase migrations)

Criar 13 tabelas via migrations, na ordem correta de dependências:

1. `moradores` (id serial PK, nome, apartamento, bloco, telefone, email, cpf, veiculo_placa, foto_url, status, data_entrada, observacoes, timestamps)
2. `encomendas` (FK moradores)
3. `visitantes`
4. `ocorrencias` (FK moradores)
5. `financeiro` (FK moradores)
6. `assembleias`
7. `votacoes` (FK assembleias)
8. `areas_comuns`
9. `reservas` (FK areas_comuns, FK moradores)
10. `documentos_juridicos`
11. `notificacoes_juridicas` (FK moradores)
12. `alertas_defcom`
13. `logs_interacao` (FK moradores)

Depois: `user_roles` table + `is_admin()` helper function + RLS policies (admin-only access on all tables).

## Fase 2 -- Autenticacao

- Ativar Supabase Auth (email/password)
- Criar pagina de login
- Proteger todas as rotas com auth guard
- Seed de admin user via `user_roles`

## Fase 3 -- Design system (CSS + Layout)

Portar do original:
- `index.css` com tema dark industrial (background 240 10% 4%, primary 210 100% 50%, etc.)
- Fontes: Chakra Petch (headings) + DM Sans (body)
- `AppLayout` component com sidebar navegavel (grupos: Principal, Portaria, Gestao, Seguranca & Juridico)
- Animacao `pulse-red` para alertas criticos
- Scrollbar customizado

## Fase 4 -- Paginas (10 telas)

Cada pagina usa `supabase.from('tabela').select()` direto, com React Query para cache/polling:

1. **Dashboard** -- KPIs (encomendas pendentes, visitantes dentro, ocorrencias abertas, inadimplentes, saldo caixa, alertas criticos, total moradores). Quick access links.
2. **Moradores** -- Lista com filtro por apartamento/bloco/status
3. **Encomendas** -- Lista com join moradores, filtro por status, acao de atualizar status
4. **Visitantes** -- Lista com filtro tipo/dentro, registrar entrada/saida
5. **Ocorrencias** -- CRUD com filtros tipo/status/prioridade
6. **Financeiro** -- Resumo (saldo, receitas, despesas), lista de lancamentos, criar lancamento
7. **Assembleias** -- Lista com votacoes, criar assembleia
8. **Reservas** -- Lista com join areas + moradores, criar reserva
9. **Juridico** -- Documentos + notificacoes juridicas
10. **DefCom** -- Alertas de seguranca com polling 15s, acoes de arquivar/resolver

## Fase 5 -- Seed data

Inserir dados de exemplo (4 moradores, encomendas, visitantes, ocorrencias, financeiro, areas comuns, reservas, assembleias, documentos, alertas) para teste imediato.

## Detalhes tecnicos

- Total de migrations: ~3 (tabelas base, user_roles + RLS, seed)
- Total de arquivos novos: ~20 (10 paginas, layout, login, supabase client, CSS, types)
- Todas as queries usam `.from().select()` do Supabase client (sem raw SQL no frontend)
- Polling via React Query `refetchInterval` (30s listagens, 15s DefCom)

## Resultado final

App completa publicavel pelo Lovable, sem necessidade de Railway, Express, ou deploy manual. Banco e auth gerenciados pelo Supabase Cloud integrado.

