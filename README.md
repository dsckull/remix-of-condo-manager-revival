# Remix of Condo Manager Revival

DIAGNÓSTICO TÉCNICO — ESTADO ATUAL
Regressão confirmada. Esta versão (Brand-Visual-Identity) tem design neomórfico excelente, mas perdeu toda a funcionalidade do Condo-Manager original:
ComponenteOriginal (Condo-Manager)Atual (Brand-Visual-Identity)DB Schema10 tabelas completasVazio (só export {})API Routes12 rotas reaisSó /healthzPáginasDados reais via React QueryMock data hardcodedBuildFuncionalQuebrado (PORT obrigatório)

PLANO DE EXECUÇÃO — REVISÃO 02
FASE 0 — PRÉ-CONDIÇÃO (5 min, você)
Abrir o arquivo Condo-Manager original (o .tar.gz exportado antes) e deixar disponível. Ele é a fonte de verdade do backend.

FASE 1 — DESBLOQUEIO DE BUILD (eu faço agora)
Problema: vite.config.ts lança exceção se PORT e BASE_PATH não estiverem definidos no ambiente de build. Isso quebra o Railway e o Dockerfile.
Fix: Tornar as variáveis opcionais com fallback.
Também: excluir mockup-sandbox do comando de build raiz.

FASE 2 — RESTAURAÇÃO DO BACKEND (eu faço)
Copiar do Condo-Manager original para esta versão:

lib/db/src/schema/ — as 10 tabelas
artifacts/api-server/src/routes/ — as 12 rotas
Atualizar lib/api-spec/openapi.yaml e regenerar tipos


FASE 3 — INTEGRAÇÃO FRONTEND (eu faço)
Substituir mock data nas 6 páginas por chamadas reais via React Query, usando os hooks já gerados em lib/api-client-react.

FASE 4 — DEPLOY (Railway)
Criar railway.json correto:
json{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm --filter @workspace/conserje run build && pnpm --filter @workspace/api-server run build"
  },
  "deploy": {
    "startCommand": "node artifacts/api-server/dist/index.mjs"
  }
}
E variáveis no Railway:
DATABASE_URL=postgresql://postgres.xqntkuwtfhpicjkjqaax:SENHA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
NODE_ENV=production
PORT=5000
BASE_PATH=/

Pergunta antes de executar: você tem acesso ao arquivo original do Condo-Manager (o ReplitExport-covuptzlrf_tar.gz)? Ele está no histórico desta conversa. Preciso das rotas e schema completos para a Fase 2. Posso usar o que já tenho aqui no contexto?Se nao me engano, voce tem tudo sobre o projeto17:24Inventariou recursos disponíveis e preparou execuçãoInventariou recursos disponíveis e preparou execuçãoCorreto. Tenho tudo. Executando agora.Executou 17 comandos, leu um arquivoExecutou 17 comandos, leu um arquivoPronto. O que foi feito:
FASE 1 — Build desbloqueado:

vite.config.ts — PORT e BASE_PATH agora têm fallback, build não quebra mais
package.json raiz — mockup-sandbox excluído do build

FASE 2 — Backend restaurado:

10 tabelas do DB schema reinseridas em lib/db/src/schema/
12 rotas de API restauradas em artifacts/api-server/src/routes/
app.ts atualizado com static serving do frontend em produção
lib/api-zod e lib/api-client-react com todos os tipos gerados

FASE 3 — Frontend integrado:

Dashboard, Encomendas, Visitantes, Financeiro, Reservas, BotLogs — todos conectados à API real via React Query, sem mock data

FASE 4 — Deploy configurado:

railway.json correto com build e start commands
.env.example documentado

Próximo passo: sobe esse .tar.gz no GitHub e configura as 3 variáveis no Railway:
DATABASE_URL=postgresql://postgres.xqntkuwtfhpicjkjqaax:SENHA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
NODE_ENV=production
PORT=5000

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/32a0de4b-4224-44a2-8763-fcd85dc3b64e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
