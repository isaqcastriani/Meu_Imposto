import bcrypt from 'bcryptjs';
import { pool, transaction } from '../db.js';
import { calcularDAS, vencimentoDAS } from '../services/das.js';

// Dados de conteudo global (espelham o data.js do frontend)
const TUTORIAIS = [
  ['Como emitir sua primeira NFS-e', 'NFS-e', '8 min', 'Facil'],
  ['DASN-SIMEI: passo a passo da declaracao anual', 'Declaracoes', '12 min', 'Medio'],
  ['Como atualizar sua atividade (CNAE)', 'Cadastro', '6 min', 'Facil'],
  ['Gerando o DAS no PGMEI', 'Imposto', '5 min', 'Facil'],
  ['Solicitar auxilio-doenca como MEI', 'Beneficios', '10 min', 'Medio'],
  ['O que fazer ao ultrapassar o teto', 'Imposto', '9 min', 'Medio'],
  ['Cancelando uma NFS-e', 'NFS-e', '4 min', 'Facil'],
  ['Salario-maternidade para MEI', 'Beneficios', '8 min', 'Facil'],
  ['Como pagar DAS atrasado', 'Imposto', '6 min', 'Facil'],
  ['Baixar comprovante de inscricao (CCMEI)', 'Cadastro', '3 min', 'Facil'],
  ['Adicionar atividade secundaria', 'Cadastro', '7 min', 'Medio'],
  ['Recuperando senha do Gov.br', 'Outros', '4 min', 'Facil'],
  ['Aposentadoria por idade do MEI', 'Beneficios', '11 min', 'Medio'],
  ['Erros comuns na emissao de NFS-e', 'NFS-e', '7 min', 'Medio'],
  ['Baixar MEI: como dar baixa no CNPJ', 'Cadastro', '10 min', 'Medio'],
];

const ATALHOS = [
  ['PGMEI', 'Geracao e pagamento do DAS', 'Impostos', 'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/', 1],
  ['Portal do Simples Nacional', 'DASN-SIMEI e parcelamentos', 'Impostos', 'https://www8.receita.fazenda.gov.br/SimplesNacional/', 2],
  ['Redesim', 'Abertura e alteracao de empresa', 'Cadastro', 'https://www.gov.br/empresas-e-negocios/pt-br/redesim', 3],
  ['e-CAC', 'Centro virtual da Receita Federal', 'Impostos', 'https://cav.receita.fazenda.gov.br/', 4],
  ['Portal NFS-e Nacional', 'Emissao de notas fiscais de servico', 'Notas Fiscais', 'https://www.nfse.gov.br/', 5],
  ['Meu INSS', 'Beneficios previdenciarios', 'Beneficios', 'https://meu.inss.gov.br/', 6],
  ['Portal do Empreendedor', 'Cadastro e CCMEI', 'Cadastro', 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor', 7],
];

const LANCAMENTOS = [
  [0, 2, 'Projeto site institucional - Acme', 'Servicos', 'receita', 4500],
  [0, 5, 'Aluguel coworking', 'Aluguel', 'despesa', 450],
  [0, 8, 'Manutencao mensal - Cliente B', 'Servicos', 'receita', 1200],
  [0, 10, 'Anuncios Google Ads', 'Marketing', 'despesa', 320],
  [0, 14, 'Consultoria SEO', 'Servicos', 'receita', 2800],
  [1, 3, 'Desenvolvimento app mobile', 'Servicos', 'receita', 6500],
  [1, 6, 'Notebook (insumo)', 'Insumos', 'despesa', 4200],
  [1, 12, 'Hospedagem anual', 'Insumos', 'despesa', 890],
  [1, 20, 'Mensalidade cliente C', 'Servicos', 'receita', 1500],
  [2, 4, 'Landing page - Startup X', 'Servicos', 'receita', 3200],
  [2, 9, 'Uber para reunioes', 'Transporte', 'despesa', 240],
  [2, 18, 'Curso online', 'Outros', 'despesa', 380],
  [3, 5, 'Projeto e-commerce', 'Servicos', 'receita', 5800],
  [3, 15, 'Software de design', 'Insumos', 'despesa', 180],
  [4, 7, 'Manutencao mensal - Cliente B', 'Servicos', 'receita', 1200],
  [4, 22, 'Marketing digital', 'Marketing', 'despesa', 600],
  [5, 10, 'Sistema interno - Empresa Y', 'Servicos', 'receita', 7200],
  [6, 14, 'Consultoria tecnica', 'Servicos', 'receita', 2400],
];

function isoMes(mesesAtras, dia) {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() - mesesAtras, dia).toISOString().slice(0, 10);
}

async function main() {
  console.log('[seed] Inserindo conteudo global...');
  // Tutoriais e atalhos (idempotente: limpa e reinsere)
  await pool.query('delete from tutoriais');
  for (const [titulo, categoria, tempo, dif] of TUTORIAIS) {
    await pool.query(
      'insert into tutoriais (titulo, categoria, tempo, dificuldade) values ($1,$2,$3,$4)',
      [titulo, categoria, tempo, dif]
    );
  }
  await pool.query('delete from atalhos_gov');
  for (const [nome, desc, cat, url, ordem] of ATALHOS) {
    await pool.query(
      'insert into atalhos_gov (nome, descricao, categoria, url, ordem) values ($1,$2,$3,$4,$5)',
      [nome, desc, cat, url, ordem]
    );
  }

  // Admin demo
  console.log('[seed] Criando usuarios demo...');
  const senhaAdmin = await bcrypt.hash('admin1234', 10);
  await pool.query(
    `insert into usuarios (nome, email, senha_hash, role)
     values ('Administrador', 'admin@meuimposto.app', $1, 'admin')
     on conflict (email) do nothing`,
    [senhaAdmin]
  );

  // MEI demo: Maria da Silva (login: maria@silva.me / demo1234)
  const senhaMaria = await bcrypt.hash('demo1234', 10);
  const userId = await transaction(async (client) => {
    const { rows } = await client.query(
      `insert into usuarios (nome, email, senha_hash, role)
       values ('Maria da Silva', 'maria@silva.me', $1, 'mei')
       on conflict (email) do update set nome = excluded.nome
       returning id`,
      [senhaMaria]
    );
    const id = rows[0].id;
    await client.query(
      `insert into perfis_mei (user_id, cpf, telefone, razao_social, nome_fantasia, cnpj, cnae, cnae_desc, tipo, abertura, situacao, endereco)
       values ($1,'123.456.789-00','(11) 98765-4321','MARIA DA SILVA SERVICOS DIGITAIS','Silva Digital','12.345.678/0001-90','6201-5/01','Desenvolvimento de programas de computador sob encomenda','Servicos','2023-01-15','ATIVA','Rua das Flores, 123 - Vila Mariana, Sao Paulo/SP, 04101-000')
       on conflict (user_id) do nothing`,
      [id]
    );
    return id;
  });

  // Lancamentos da Maria
  console.log('[seed] Inserindo lancamentos demo...');
  await pool.query('delete from lancamentos where user_id=$1', [userId]);
  for (const [m, dia, desc, cat, tipo, valor] of LANCAMENTOS) {
    await pool.query(
      'insert into lancamentos (user_id, data, descricao, categoria, tipo, valor) values ($1,$2,$3,$4,$5,$6)',
      [userId, isoMes(m, dia), desc, cat, tipo, valor]
    );
  }

  // Historico de DAS (6 meses)
  console.log('[seed] Gerando historico de DAS...');
  await pool.query('delete from das_guias where user_id=$1', [userId]);
  const calc = calcularDAS('Servicos');
  for (let i = 0; i < 6; i++) {
    const hoje = new Date();
    const comp = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const venc = vencimentoDAS(comp);
    await pool.query(
      `insert into das_guias (user_id, competencia, vencimento, valor, inss, iss, icms, status)
       values ($1,$2,$3,$4,$5,$6,$7,$8) on conflict (user_id, competencia) do nothing`,
      [userId, comp.toISOString().slice(0, 10), venc.toISOString().slice(0, 10),
       calc.total, calc.inss, calc.iss, calc.icms, i === 0 ? 'pendente' : 'pago']
    );
  }

  // Alertas demo
  await pool.query('delete from alertas where user_id=$1', [userId]);
  const alertas = [
    ['warning', 'DAS deste mes vence dia 20', 'Gere o boleto no PGMEI para evitar juros.'],
    ['info', 'DASN-SIMEI: prazo ate 31/05', 'Declaracao anual obrigatoria.'],
    ['warning', 'Voce atingiu 65% do teto MEI', 'Acompanhe seu faturamento acumulado.'],
  ];
  for (const [tipo, titulo, desc] of alertas) {
    await pool.query(
      'insert into alertas (user_id, tipo, titulo, descricao) values ($1,$2,$3,$4)',
      [userId, tipo, titulo, desc]
    );
  }

  console.log('\n[seed] Concluido!');
  console.log('  MEI demo:   maria@silva.me / demo1234');
  console.log('  Admin demo: admin@meuimposto.app / admin1234\n');
  await pool.end();
}

main().catch((e) => {
  console.error('[seed] Falhou:', e.message);
  process.exit(1);
});
