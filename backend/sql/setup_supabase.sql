
create extension if not exists "pgcrypto";


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

create table if not exists das_guias (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references usuarios(id) on delete cascade,
  competencia date not null,
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

create table if not exists alertas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references usuarios(id) on delete cascade,
  tipo        text not null default 'info' check (tipo in ('info','warning','erro')),
  titulo      text not null,
  descricao   text,
  lida        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_alertas_user on alertas(user_id, created_at);

create table if not exists tutoriais (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  categoria   text not null,
  tempo       text,
  dificuldade text default 'Facil' check (dificuldade in ('Facil','Medio','Dificil')),
  conteudo    text,
  created_at  timestamptz not null default now()
);

create table if not exists atalhos_gov (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text,
  categoria   text,
  url         text not null,
  ordem       int not null default 0,
  created_at  timestamptz not null default now()
);


insert into usuarios (nome, email, senha_hash, role) values
  ('Maria da Silva', 'maria@silva.me', '$2a$10$DutaN/pRozQ9c9Plhnusx.5ngMqV/RJPnqJGiP/YUa0fFFEG/Td6W', 'mei'),
  ('Administrador', 'admin@meuimposto.app', '$2a$10$iZuHmtC.iC.4WLWA4s7p3OImZXuNKtNmol7UChnr7MB.QkCg/jWNK', 'admin')
on conflict (email) do update set senha_hash = excluded.senha_hash, nome = excluded.nome;

insert into perfis_mei (user_id, cpf, telefone, razao_social, nome_fantasia, cnpj, cnae, cnae_desc, tipo, abertura, situacao, endereco)
select id, '123.456.789-00', '(11) 98765-4321', 'MARIA DA SILVA SERVICOS DIGITAIS', 'Silva Digital',
       '12.345.678/0001-90', '6201-5/01', 'Desenvolvimento de programas de computador sob encomenda',
       'Servicos', '2023-01-15', 'ATIVA', 'Rua das Flores, 123 - Vila Mariana, Sao Paulo/SP, 04101-000'
from usuarios where email = 'maria@silva.me'
on conflict (user_id) do nothing;

delete from lancamentos where user_id = (select id from usuarios where email='maria@silva.me');
insert into lancamentos (user_id, data, descricao, categoria, tipo, valor)
select u.id, v.data, v.descricao, v.categoria, v.tipo, v.valor
from usuarios u,
(values
  ((date_trunc('month', now()) - interval '0 months')::date + 1,  'Projeto site institucional - Acme', 'Servicos',  'receita', 4500),
  ((date_trunc('month', now()) - interval '0 months')::date + 4,  'Aluguel coworking',                'Aluguel',   'despesa', 450),
  ((date_trunc('month', now()) - interval '0 months')::date + 7,  'Manutencao mensal - Cliente B',    'Servicos',  'receita', 1200),
  ((date_trunc('month', now()) - interval '0 months')::date + 9,  'Anuncios Google Ads',              'Marketing', 'despesa', 320),
  ((date_trunc('month', now()) - interval '0 months')::date + 13, 'Consultoria SEO',                  'Servicos',  'receita', 2800),
  ((date_trunc('month', now()) - interval '1 months')::date + 2,  'Desenvolvimento app mobile',       'Servicos',  'receita', 6500),
  ((date_trunc('month', now()) - interval '1 months')::date + 5,  'Notebook (insumo)',                'Insumos',   'despesa', 4200),
  ((date_trunc('month', now()) - interval '1 months')::date + 11, 'Hospedagem anual',                 'Insumos',   'despesa', 890),
  ((date_trunc('month', now()) - interval '1 months')::date + 19, 'Mensalidade cliente C',            'Servicos',  'receita', 1500),
  ((date_trunc('month', now()) - interval '2 months')::date + 3,  'Landing page - Startup X',         'Servicos',  'receita', 3200),
  ((date_trunc('month', now()) - interval '2 months')::date + 8,  'Uber para reunioes',               'Transporte','despesa', 240),
  ((date_trunc('month', now()) - interval '2 months')::date + 17, 'Curso online',                     'Outros',    'despesa', 380),
  ((date_trunc('month', now()) - interval '3 months')::date + 4,  'Projeto e-commerce',               'Servicos',  'receita', 5800),
  ((date_trunc('month', now()) - interval '3 months')::date + 14, 'Software de design',               'Insumos',   'despesa', 180),
  ((date_trunc('month', now()) - interval '4 months')::date + 6,  'Manutencao mensal - Cliente B',    'Servicos',  'receita', 1200),
  ((date_trunc('month', now()) - interval '4 months')::date + 21, 'Marketing digital',                'Marketing', 'despesa', 600),
  ((date_trunc('month', now()) - interval '5 months')::date + 9,  'Sistema interno - Empresa Y',      'Servicos',  'receita', 7200),
  ((date_trunc('month', now()) - interval '6 months')::date + 13, 'Consultoria tecnica',              'Servicos',  'receita', 2400)
) as v(data, descricao, categoria, tipo, valor)
where u.email = 'maria@silva.me';

delete from das_guias where user_id = (select id from usuarios where email='maria@silva.me');
insert into das_guias (user_id, competencia, vencimento, valor, inss, iss, icms, status)
select u.id,
       (date_trunc('month', now()) - (i || ' months')::interval)::date as competencia,
       ((date_trunc('month', now()) - (i || ' months')::interval)::date + interval '1 month' + interval '19 days')::date as vencimento,
       80.90, 75.90, 5.00, 0,
       case when i = 0 then 'pendente' else 'pago' end
from usuarios u, generate_series(0,5) as i
where u.email = 'maria@silva.me'
on conflict (user_id, competencia) do nothing;

delete from alertas where user_id = (select id from usuarios where email='maria@silva.me');
insert into alertas (user_id, tipo, titulo, descricao)
select u.id, v.tipo, v.titulo, v.descricao
from usuarios u,
(values
  ('warning', 'DAS deste mes vence dia 20',       'Gere o boleto no PGMEI para evitar juros.'),
  ('info',    'DASN-SIMEI: prazo ate 31/05',       'Declaracao anual obrigatoria.'),
  ('warning', 'Voce atingiu 65% do teto MEI',      'Acompanhe seu faturamento acumulado.')
) as v(tipo, titulo, descricao)
where u.email = 'maria@silva.me';

delete from tutoriais;
insert into tutoriais (titulo, categoria, tempo, dificuldade) values
  ('Como emitir sua primeira NFS-e', 'NFS-e', '8 min', 'Facil'),
  ('DASN-SIMEI: passo a passo da declaracao anual', 'Declaracoes', '12 min', 'Medio'),
  ('Como atualizar sua atividade (CNAE)', 'Cadastro', '6 min', 'Facil'),
  ('Gerando o DAS no PGMEI', 'Imposto', '5 min', 'Facil'),
  ('Solicitar auxilio-doenca como MEI', 'Beneficios', '10 min', 'Medio'),
  ('O que fazer ao ultrapassar o teto', 'Imposto', '9 min', 'Medio'),
  ('Cancelando uma NFS-e', 'NFS-e', '4 min', 'Facil'),
  ('Salario-maternidade para MEI', 'Beneficios', '8 min', 'Facil'),
  ('Como pagar DAS atrasado', 'Imposto', '6 min', 'Facil'),
  ('Baixar comprovante de inscricao (CCMEI)', 'Cadastro', '3 min', 'Facil'),
  ('Adicionar atividade secundaria', 'Cadastro', '7 min', 'Medio'),
  ('Recuperando senha do Gov.br', 'Outros', '4 min', 'Facil'),
  ('Aposentadoria por idade do MEI', 'Beneficios', '11 min', 'Medio'),
  ('Erros comuns na emissao de NFS-e', 'NFS-e', '7 min', 'Medio'),
  ('Baixar MEI: como dar baixa no CNPJ', 'Cadastro', '10 min', 'Medio');

delete from atalhos_gov;
insert into atalhos_gov (nome, descricao, categoria, url, ordem) values
  ('PGMEI', 'Geracao e pagamento do DAS', 'Impostos', 'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/', 1),
  ('Portal do Simples Nacional', 'DASN-SIMEI e parcelamentos', 'Impostos', 'https://www8.receita.fazenda.gov.br/SimplesNacional/', 2),
  ('Redesim', 'Abertura e alteracao de empresa', 'Cadastro', 'https://www.gov.br/empresas-e-negocios/pt-br/redesim', 3),
  ('e-CAC', 'Centro virtual da Receita Federal', 'Impostos', 'https://cav.receita.fazenda.gov.br/', 4),
  ('Portal NFS-e Nacional', 'Emissao de notas fiscais de servico', 'Notas Fiscais', 'https://www.nfse.gov.br/', 5),
  ('Meu INSS', 'Beneficios previdenciarios', 'Beneficios', 'https://meu.inss.gov.br/', 6),
  ('Portal do Empreendedor', 'Cadastro e CCMEI', 'Cadastro', 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor', 7);

select 'usuarios' as tabela, count(*) from usuarios
union all select 'lancamentos', count(*) from lancamentos
union all select 'das_guias', count(*) from das_guias
union all select 'tutoriais', count(*) from tutoriais
union all select 'atalhos_gov', count(*) from atalhos_gov;
