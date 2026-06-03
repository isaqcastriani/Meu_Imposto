# 🔌 Meu Imposto — Backend (API REST)

API REST do **Meu Imposto** em **Node.js + Express**, com **PostgreSQL (Supabase)** como banco e autenticação **JWT**.

## 🧱 Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Banco | PostgreSQL (Supabase) via `pg` |
| Auth | JWT (`jsonwebtoken`) + senhas com `bcryptjs` |
| Validação | `zod` |
| Integração | BrasilAPI (consulta de CNPJ) |

## 📂 Estrutura

```
backend/
├── sql/schema.sql          # schema do banco (rode no Supabase)
├── src/
│   ├── server.js           # bootstrap do Express
│   ├── config.js           # variaveis de ambiente
│   ├── db.js               # pool de conexao Postgres
│   ├── middleware/         # auth (JWT) + tratamento de erros
│   ├── services/           # regras: calculo do DAS, simulador
│   ├── routes/             # endpoints da API
│   └── scripts/            # migrate.js e seed.js
└── .env.example
```

## 🚀 Como rodar

### 1. Crie o projeto no Supabase
1. Acesse <https://supabase.com> → **New project**.
2. Defina uma **Database Password** (guarde!).
3. Em **Project Settings → Database → Connection string → Transaction pooler**, copie a URI.

### 2. Configure o ambiente
```bash
cd backend
cp .env.example .env
# edite .env: cole a DATABASE_URL e gere um JWT_SECRET
npm install
```

### 3. Crie as tabelas e popule
```bash
npm run setup      # roda migrate (schema) + seed (dados demo)
```
> Alternativa: abra `sql/schema.sql` e cole no **SQL Editor** do Supabase.

### 4. Suba a API
```bash
npm run dev        # http://localhost:4000
```
Teste: <http://localhost:4000/api/health>

## 👤 Usuários demo (após o seed)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| MEI | `maria@silva.me` | `demo1234` |
| Admin | `admin@meuimposto.app` | `admin1234` |

## 📡 Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastro de MEI |
| POST | `/api/auth/login` | Login (retorna JWT) |
| GET | `/api/auth/me` | Usuário autenticado |
| GET/PUT | `/api/perfil` | Perfil do MEI |
| GET/POST/PUT/DELETE | `/api/lancamentos` | Receitas e despesas |
| GET | `/api/financeiro/resumo` | Faturamento, % teto, saldo |
| GET | `/api/das/atual` · `/historico` | Cálculo e histórico do DAS |
| POST | `/api/das/gerar` · `/:id/pagar` | Gera/paga guia |
| GET/POST | `/api/nfse` | Lista e emite NFS-e |
| POST | `/api/nfse/:id/cancelar` | Cancela nota |
| GET | `/api/calendario` | Obrigações fiscais do ano |
| GET | `/api/tutoriais` · `/atalhos` | Conteúdo |
| GET | `/api/alertas` | Notificações |
| GET | `/api/cnpj/:cnpj` | Consulta CNPJ (BrasilAPI) |
| POST | `/api/simulador` | Simulador de desenquadramento |
| GET | `/api/beneficios` | Benefícios previdenciários |
| GET | `/api/admin/metricas` | Métricas (admin) |
| GET/PATCH | `/api/admin/usuarios` | Gestão de usuários (admin) |
| CRUD | `/api/admin/tutoriais` · `/atalhos` | Gestão de conteúdo (admin) |

Todas as rotas (exceto `/auth/*` e `/health`) exigem header `Authorization: Bearer <token>`.

## 🔐 Segurança
- Senhas com hash `bcrypt`.
- JWT com expiração configurável.
- Rate limit nas rotas de autenticação.
- Validação de entrada com `zod`.
- A API faz toda a autorização; o acesso ao banco usa conexão server-side (não exponha a `DATABASE_URL`).
