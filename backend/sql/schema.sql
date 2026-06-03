-- ============================================================
--  Meu Imposto - Schema do banco (Supabase / PostgreSQL)
--  Pode rodar direto no SQL Editor do Supabase, ou via `npm run migrate`.
--  Idempotente: pode rodar mais de uma vez sem quebrar.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Usuarios ----------
create table if not exists usuarios (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text not null unique,
  senha_hash  text not null,
  role        text not null default 'mei' check (role in ('mei','admin')),
  status      text not null default 'ativo' check (status in ('ativo','inativo')),
  last_login  timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------- Perfil MEI (1:1 com usuario) ----------
create table if not exists perfis_mei (
  user_id       uuid primary key references usuarios(id) on delete cascade,
  cpf           text,
  telefone      text,
  razao_social  text,
  nome_fantasia text,
  cnpj          text,
  cnae          text,
  cnae_desc     text,
  tipo          text default 'Servicos' check (tipo in ('Servicos','Comercio','Industria','Comercio e Servicos')),
  abertura      date,
  situacao      text default 'ATIVA',
  endereco      text,
  teto          numeric(12,2) not null default 81000,
  updated_at    timestamptz not null default now()
);

-- ---------- Lancamentos financeiros ----------
create table if not exists lancamentos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references usuarios(id) on delete cascade,
  data        date not null,
  descricao   text not null,
  categoria   text not null default 'Outros',
  tipo        text not null check (tipo in ('receita','despesa')),
  valor       numeric(12,2) not null check (valor >= 0),
  created_at  timestamptz not null default now()
);
create index if not exists idx_lancamentos_user on lancamentos(user_id, data);

-- ---------- Guias DAS ----------
create table if not exists das_guias (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references usuarios(id) on delete cascade,
  competencia date not null,            -- primeiro dia do mes de competencia
  vencimento  date not null,
  valor       numeric(10,2) not null,
  inss        numeric(10,2) not null default 0,
  iss         numeric(10,2) not null default 0,
  icms        numeric(10,2) not null default 0,
  status      text not null default 'pendente' check (status in ('pendente','pago')),
  created_at  timestamptz not null default now(),
  unique (user_id, competencia)
);
create index if not exists idx_das_user on das_guias(user_id, competencia);

-- ---------- NFS-e ----------
create table if not exists nfse (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references usuarios(id) on delete cascade,
  numero      text not null,
  data        date not null default current_date,
  tomador     text not null,
  tomador_doc text,
  descricao   text,
  valor       numeric(12,2) not null check (valor >= 0),
  status      text not null default 'emitida' check (status in ('emitida','cancelada','pendente')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_nfse_user on nfse(user_id, data);

-- ---------- Alertas / Notificacoes ----------
create table if not exists alertas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references usuarios(id) on delete cascade,  -- null = global
  tipo        text not null default 'info' check (tipo in ('info','warning','erro')),
  titulo      text not null,
  descricao   text,
  lida        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_alertas_user on alertas(user_id, created_at);

-- ---------- Tutoriais (conteudo global) ----------
create table if not exists tutoriais (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  categoria   text not null,
  tempo       text,
  dificuldade text default 'Facil' check (dificuldade in ('Facil','Medio','Dificil')),
  conteudo    text,
  created_at  timestamptz not null default now()
);

-- ---------- Atalhos Gov.br (global) ----------
create table if not exists atalhos_gov (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text,
  categoria   text,
  url         text not null,
  ordem       int not null default 0,
  created_at  timestamptz not null default now()
);
