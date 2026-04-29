<div align="center">

# 💼 Meu Imposto

### Toda a burocracia do MEI em um só lugar

**Plataforma web que simplifica e centraliza a gestão fiscal do Microempreendedor Individual no Brasil.**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()

[Visão Geral](#-visão-geral) •
[Funcionalidades](#-funcionalidades) •
[Tecnologias](#️-tecnologias) •
[Como Rodar](#-como-rodar) •
[Documentação](#-documentação)

---

</div>

## 📖 Visão Geral

O **Meu Imposto** é uma plataforma web desenvolvida para resolver uma dor real de mais de **15 milhões de Microempreendedores Individuais** no Brasil: a burocracia fragmentada entre dezenas de sites do governo, cálculos de imposto manuais, prazos esquecidos e o medo constante de estourar o teto de faturamento.

A plataforma centraliza em uma única experiência:

> 🎯 **Cadastro automático via CNPJ** • 📊 **Painel financeiro inteligente** • 💰 **Cálculo automático do DAS** • 🚨 **Alertas de teto** • 🧾 **Emissão de NFS-e** • 📚 **Tutoriais contextuais do Gov.br** • 🔄 **Simulador de desenquadramento**

Este projeto está sendo desenvolvido como **Projeto Integrador do curso de Sistemas de Informação**, com aplicação web completa (front-end + back-end).

---

## ✨ Funcionalidades

### 👤 Para o MEI

<table>
<tr>
<td width="50%" valign="top">

#### 🏠 Painel de Gestão
Dashboard personalizado com faturamento acumulado, próximas obrigações fiscais, valor do DAS do mês, alertas e atalhos rápidos.

#### 💸 Controle Financeiro
Registro de receitas e despesas com cálculo automático de saldo mensal e faturamento acumulado.

#### 🧮 Calculadora de DAS
Cálculo automático do DAS mensal com base no CNAE, com detalhamento de INSS, ICMS e ISS.

#### 📅 Calendário Fiscal
Datas de vencimento do DAS, DASN-SIMEI e outras obrigações com notificações automáticas.

#### 🚨 Alerta de Teto
Monitoramento contínuo do faturamento com avisos automáticos ao atingir 80% e 100% do teto de R$ 81.000.

</td>
<td width="50%" valign="top">

#### 🔄 Simulador de Desenquadramento
Calcula o impacto de ultrapassar o teto: novo regime, estimativa de impostos e passo a passo.

#### 🧾 Emissão de NFS-e
Integração com a API Nacional da NFS-e e fallback inteligente para o portal oficial.

#### 📚 Tutoriais Contextuais
Conteúdo passo a passo dos processos do Gov.br, filtrado pelo perfil do MEI.

#### 🔗 Atalhos Gov.br
Acesso direto a PGMEI, Simples Nacional, Redesim, e-CAC e portal da NFS-e.

#### 💚 Benefícios Previdenciários
Cálculo de carências e estimativas para auxílio-doença, salário-maternidade e aposentadoria.

#### 📊 Relatórios Financeiros
Gráficos de faturamento, despesas e lucro com exportação em PDF.

</td>
</tr>
</table>

### 🛡️ Para o Administrador

- **Painel administrativo** com métricas de uso e total de usuários
- **Gestão de tutoriais** sem necessidade de alterar código
- **Gestão de atalhos** e conteúdos da plataforma
- **Gestão de usuários** (ativar/desativar contas)

---

## 📐 Arquitetura

```
┌────────────────────────────────────────────────────────────┐
│                       FRONT-END (React)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │  Páginas   │  │ Componentes│  │  Estado Global     │   │
│  │  do MEI    │  │   shadcn   │  │  (Context/Zustand) │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└───────────────────────────┬────────────────────────────────┘
                            │ REST API + JWT
┌───────────────────────────▼────────────────────────────────┐
│                       BACK-END (API)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │   Auth     │  │  Negócio   │  │   Integrações      │   │
│  │   (JWT)    │  │  (Regras)  │  │  Externas          │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└──────┬──────────────────┬──────────────────────┬──────────┘
       │                  │                      │
       ▼                  ▼                      ▼
┌──────────────┐  ┌──────────────┐  ┌────────────────────┐
│   Database   │  │  BrasilAPI/  │  │  API Nacional      │
│              │  │  ReceitaWS   │  │  NFS-e             │
└──────────────┘  └──────────────┘  └────────────────────┘
```

---

## 🛠️ Tecnologias

### Front-end
- ⚛️ **React 18** + **TypeScript**
- ⚡ **Vite** como build tool
- 🎨 **Tailwind CSS** + **shadcn/ui**
- 🧭 **React Router v6**
- 📊 **Recharts** para gráficos
- 📝 **React Hook Form** + **Zod** para validação
- 🔔 **Sonner** para notificações
- 🎯 **Lucide React** para ícones

### Back-end
- 🟢 Node.js / Express *(a definir)*
- 🔐 **JWT** para autenticação
- 🗄️ Banco de dados relacional

### Integrações
- 🏛️ **BrasilAPI** / **ReceitaWS** — consulta de CNPJ
- 🧾 **API Nacional da NFS-e** — emissão de notas
- 🔑 **Gov.br OAuth2** *(futuro)*

---

## 📋 Requisitos do Sistema

### Requisitos Funcionais

<details>
<summary><strong>Clique para expandir os 18 RFs</strong></summary>

| ID | Requisito | Prioridade |
|------|------------|------------|
| **RF001** | Cadastro de Usuário MEI com validação automática de CNPJ | 🔴 Essencial |
| **RF002** | Autenticação e Login com JWT | 🔴 Essencial |
| **RF003** | Painel de Gestão personalizado | 🔴 Essencial |
| **RF004** | Registro de Receitas e Despesas | 🔴 Essencial |
| **RF005** | Calculadora de DAS | 🔴 Essencial |
| **RF006** | Calendário de Obrigações Fiscais | 🔴 Essencial |
| **RF007** | Alerta de Teto de Faturamento | 🔴 Essencial |
| **RF008** | Simulador de Desenquadramento | 🟡 Importante |
| **RF009** | Central de Tutoriais Contextuais | 🔴 Essencial |
| **RF010** | Emissão de NFS-e via API | 🟡 Importante |
| **RF011** | Emissão de NFS-e via Portal (Fallback) | 🟡 Importante |
| **RF012** | Consulta de CNPJ em Tempo Real | 🔴 Essencial |
| **RF013** | Atalhos para Serviços do Gov.br | 🟡 Importante |
| **RF014** | Calculadora de Isenções e Benefícios | 🟢 Desejável |
| **RF015** | Relatórios Financeiros | 🟡 Importante |
| **RF016** | Painel Administrativo | 🔴 Essencial |
| **RF017** | Gestão de Conteúdo (Admin) | 🟡 Importante |
| **RF018** | Perfil do Usuário | 🔴 Essencial |

</details>

### Casos de Uso

<details>
<summary><strong>Clique para expandir os 12 UCs</strong></summary>

| ID | Caso de Uso | Ator |
|------|-------------|------|
| **UC001** | Realizar Cadastro | Usuário MEI |
| **UC002** | Realizar Login | MEI / Admin |
| **UC003** | Visualizar Dashboard | Usuário MEI |
| **UC004** | Registrar Receita ou Despesa | Usuário MEI |
| **UC005** | Calcular DAS Mensal | Usuário MEI |
| **UC006** | Simular Desenquadramento | Usuário MEI |
| **UC007** | Emitir NFS-e | Usuário MEI |
| **UC008** | Consultar Tutoriais | Usuário MEI |
| **UC009** | Gerenciar Tutoriais | Administrador |
| **UC010** | Visualizar Painel Administrativo | Administrador |
| **UC011** | Gerar Relatório Financeiro | Usuário MEI |
| **UC012** | Consultar Isenções e Benefícios | Usuário MEI |

</details>

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/meu-imposto.git

# Entre no diretório
cd meu-imposto

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Scripts disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera a build de produção
npm run preview   # Visualiza a build de produção localmente
npm run lint      # Roda o linter
```

---

## 📂 Estrutura de Pastas

```
meu-imposto/
├── public/                    # Arquivos estáticos
├── src/
│   ├── assets/                # Imagens, ícones, fontes
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Componentes do shadcn/ui
│   │   └── layout/            # Sidebar, Topbar, etc.
│   ├── pages/                 # Páginas da aplicação
│   │   ├── auth/              # Login, Cadastro, Recuperação
│   │   ├── mei/               # Dashboard, Financeiro, DAS...
│   │   └── admin/             # Painel administrativo
│   ├── data/                  # Mock data e tipos
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilitários (formatadores, validadores)
│   ├── routes/                # Configuração de rotas
│   ├── App.tsx
│   └── main.tsx
├── docs/                      # Documentação
│   ├── requisitos.md
│   ├── casos-de-uso.md
│   └── arquitetura.md
└── README.md
```

---

## 🎨 Design System

| Elemento | Valor |
|----------|-------|
| 🎨 **Primária** | `#1E40AF` / `#2563EB` |
| 🟢 **Sucesso / Receita** | `#059669` |
| 🔴 **Alerta / Despesa** | `#DC2626` |
| 🟡 **Aviso** | `#D97706` |
| ⚪ **Fundo** | `#FAFAFA` |
| 🔤 **Tipografia** | Inter |

---

## 🗺️ Roadmap

- [x] Documentação de requisitos e casos de uso
- [x] Definição da arquitetura
- [ ] Front-end completo com mock data
- [ ] Back-end com autenticação JWT
- [ ] Integração com BrasilAPI
- [ ] Integração com API NFS-e Nacional
- [ ] Painel administrativo funcional
- [ ] Testes automatizados
- [ ] Deploy em produção
- [ ] Login via Gov.br (OAuth2)

---

## 📚 Documentação

- 📄 [Documento de Requisitos](./docs/requisitos.md)
- 📄 [Casos de Uso](./docs/casos-de-uso.md)
- 📄 [Arquitetura](./docs/arquitetura.md)

---

## 👥 Equipe

| Nome | Função | GitHub |
|------|--------|--------|
| _Em definição_ | Desenvolvimento | - |
| _Em definição_ | Desenvolvimento | - |
| _Em definição_ | Desenvolvimento | - |

---

## 📖 Glossário

| Termo | Significado |
|-------|-------------|
| **MEI** | Microempreendedor Individual |
| **DAS** | Documento de Arrecadação do Simples Nacional |
| **DASN-SIMEI** | Declaração Anual do Simples Nacional para o MEI |
| **CNAE** | Classificação Nacional de Atividades Econômicas |
| **NFS-e** | Nota Fiscal de Serviços Eletrônica |
| **Teto MEI** | Limite de R$ 81.000,00/ano de faturamento bruto |
| **PGMEI** | Programa Gerador do DAS do MEI |

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Feito com ☕ e muita pesquisa fiscal pela equipe do Meu Imposto**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
