var TETO_MEI = 81000;
var usuarioMEI = {
  nome: "Maria da Silva",
  email: "maria@silva.me",
  cpf: "123.456.789-00",
  telefone: "(11) 98765-4321",
  razaoSocial: "MARIA DA SILVA SERVICOS DIGITAIS",
  nomeFantasia: "Silva Digital",
  cnpj: "12.345.678/0001-90",
  cnae: "6201-5/01",
  cnaeDesc: "Desenvolvimento de programas de computador sob encomenda",
  tipo: "Servicos",
  abertura: "15/01/2023",
  situacao: "ATIVA",
  endereco: "Rua das Flores, 123 - Vila Mariana, Sao Paulo/SP, 04101-000"
};
function isoMes(mesesAtras, dia) {
  var hoje = new Date();
  var d = new Date(hoje.getFullYear(), hoje.getMonth() - mesesAtras, dia);
  return d.toISOString().slice(0, 10);
}
var lancamentos = [
  { id: "1", data: isoMes(0, 2), descricao: "Projeto site institucional - Acme", categoria: "Servicos", tipo: "receita", valor: 4500 },
  { id: "2", data: isoMes(0, 5), descricao: "Aluguel coworking", categoria: "Aluguel", tipo: "despesa", valor: 450 },
  { id: "3", data: isoMes(0, 8), descricao: "Manutencao mensal - Cliente B", categoria: "Servicos", tipo: "receita", valor: 1200 },
  { id: "4", data: isoMes(0, 10), descricao: "Anuncios Google Ads", categoria: "Marketing", tipo: "despesa", valor: 320 },
  { id: "5", data: isoMes(0, 14), descricao: "Consultoria SEO", categoria: "Servicos", tipo: "receita", valor: 2800 },
  { id: "6", data: isoMes(1, 3), descricao: "Desenvolvimento app mobile", categoria: "Servicos", tipo: "receita", valor: 6500 },
  { id: "7", data: isoMes(1, 6), descricao: "Notebook (insumo)", categoria: "Insumos", tipo: "despesa", valor: 4200 },
  { id: "8", data: isoMes(1, 12), descricao: "Hospedagem anual", categoria: "Insumos", tipo: "despesa", valor: 890 },
  { id: "9", data: isoMes(1, 20), descricao: "Mensalidade cliente C", categoria: "Servicos", tipo: "receita", valor: 1500 },
  { id: "10", data: isoMes(2, 4), descricao: "Landing page - Startup X", categoria: "Servicos", tipo: "receita", valor: 3200 },
  { id: "11", data: isoMes(2, 9), descricao: "Uber para reunioes", categoria: "Transporte", tipo: "despesa", valor: 240 },
  { id: "12", data: isoMes(2, 18), descricao: "Curso online", categoria: "Outros", tipo: "despesa", valor: 380 },
  { id: "13", data: isoMes(3, 5), descricao: "Projeto e-commerce", categoria: "Servicos", tipo: "receita", valor: 5800 },
  { id: "14", data: isoMes(3, 15), descricao: "Software de design", categoria: "Insumos", tipo: "despesa", valor: 180 },
  { id: "15", data: isoMes(4, 7), descricao: "Manutencao mensal - Cliente B", categoria: "Servicos", tipo: "receita", valor: 1200 },
  { id: "16", data: isoMes(4, 22), descricao: "Marketing digital", categoria: "Marketing", tipo: "despesa", valor: 600 },
  { id: "17", data: isoMes(5, 10), descricao: "Sistema interno - Empresa Y", categoria: "Servicos", tipo: "receita", valor: 7200 },
  { id: "18", data: isoMes(6, 14), descricao: "Consultoria tecnica", categoria: "Servicos", tipo: "receita", valor: 2400 },
  { id: "19", data: isoMes(7, 3), descricao: "Refatoracao sistema", categoria: "Servicos", tipo: "receita", valor: 4100 },
  { id: "20", data: isoMes(8, 11), descricao: "Treinamento equipe", categoria: "Servicos", tipo: "receita", valor: 1800 }
];
var faturamentoMensal = [];
(function() {
  var hoje = new Date();
  for (var i = 11; i >= 0; i--) {
    var dt = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    var nomeMes = dt.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    nomeMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
    var valor = 0;
    for (var j = 0; j < lancamentos.length; j++) {
      var l = lancamentos[j];
      var dl = new Date(l.data);
      if (l.tipo === "receita" && dl.getMonth() === dt.getMonth() && dl.getFullYear() === dt.getFullYear()) {
        valor += l.valor;
      }
    }
    if (valor === 0) valor = Math.round(2000 + Math.random() * 5500);
    faturamentoMensal.push({ mes: nomeMes, valor: valor });
  }
})();
var faturamentoAnual = 0;
for (var i = 0; i < faturamentoMensal.length; i++) faturamentoAnual += faturamentoMensal[i].valor;
var percentTeto = Math.min(100, (faturamentoAnual / TETO_MEI) * 100);
var dasAtual = (function() {
  var hoje = new Date();
  return {
    total: 75.90,
    inss: 70.60,
    iss: 5.00,
    icms: 0,
    vencimento: "20/" + String(hoje.getMonth() + 1).padStart(2, "0") + "/" + hoje.getFullYear()
  };
})();
var historicoDAS = (function() {
  var arr = [];
  var hoje = new Date();
  for (var i = 0; i < 6; i++) {
    var d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 20);
    arr.push({
      competencia: d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      vencimento: d.toLocaleDateString("pt-BR"),
      valor: 75.90,
      status: i === 0 ? "Pendente" : "Pago"
    });
  }
  return arr;
})();
var alertas = [
  { id: 1, tipo: "warning", titulo: "DAS de novembro vence em 12 dias", desc: "Gere o boleto no PGMEI para evitar juros.", quando: "ha 2h" },
  { id: 2, tipo: "info", titulo: "DASN-SIMEI: prazo ate 31/05", desc: "Declaracao anual obrigatoria.", quando: "ontem" },
  { id: 3, tipo: "warning", titulo: "Voce atingiu 65% do teto MEI", desc: "Faltam R$ 28.350 ate o limite anual.", quando: "ha 3 dias" },
  { id: 4, tipo: "info", titulo: "Novo tutorial disponivel", desc: "Como atualizar seu CNAE no Portal do Empreendedor.", quando: "ha 5 dias" }
];
var obrigacoes = (function() {
  var hoje = new Date();
  return [
    { data: 20, mes: hoje.getMonth(), titulo: "DAS-MEI", tipo: "das", desc: "Vencimento mensal do DAS" },
    { data: 31, mes: 4, titulo: "DASN-SIMEI", tipo: "anual", desc: "Declaracao anual obrigatoria" },
    { data: 20, mes: (hoje.getMonth() + 1) % 12, titulo: "DAS-MEI", tipo: "das", desc: "Vencimento mensal do DAS" }
  ];
})();
var nfseList = (function() {
  var arr = [];
  var hoje = new Date();
  var nomes = ["Acme Tecnologia LTDA", "Joao Pereira", "Beta Comercio S.A.", "Ana Costa", "Gamma Studios"];
  var valores = [4500, 1200, 2800, 800, 6500];
  for (var i = 0; i < 10; i++) {
    var dt = new Date(hoje.getFullYear(), hoje.getMonth(), -i * 3);
    arr.push({
      id: String(i + 1),
      numero: String(2024100 + i).padStart(8, "0"),
      data: dt.toLocaleDateString("pt-BR"),
      tomador: nomes[i % 5],
      valor: valores[i % 5],
      status: i < 8 ? "Emitida" : (i === 8 ? "Cancelada" : "Pendente")
    });
  }
  return arr;
})();
var tutoriais = [
  { id: "1", titulo: "Como emitir sua primeira NFS-e", categoria: "NFS-e", tempo: "8 min", dificuldade: "Facil" },
  { id: "2", titulo: "DASN-SIMEI: passo a passo da declaracao anual", categoria: "Declaracoes", tempo: "12 min", dificuldade: "Medio" },
  { id: "3", titulo: "Como atualizar sua atividade (CNAE)", categoria: "Cadastro", tempo: "6 min", dificuldade: "Facil" },
  { id: "4", titulo: "Gerando o DAS no PGMEI", categoria: "Imposto", tempo: "5 min", dificuldade: "Facil" },
  { id: "5", titulo: "Solicitar auxilio-doenca como MEI", categoria: "Beneficios", tempo: "10 min", dificuldade: "Medio" },
  { id: "6", titulo: "O que fazer ao ultrapassar o teto", categoria: "Imposto", tempo: "9 min", dificuldade: "Medio" },
  { id: "7", titulo: "Cancelando uma NFS-e", categoria: "NFS-e", tempo: "4 min", dificuldade: "Facil" },
  { id: "8", titulo: "Salario-maternidade para MEI", categoria: "Beneficios", tempo: "8 min", dificuldade: "Facil" },
  { id: "9", titulo: "Como pagar DAS atrasado", categoria: "Imposto", tempo: "6 min", dificuldade: "Facil" },
  { id: "10", titulo: "Baixar comprovante de inscricao (CCMEI)", categoria: "Cadastro", tempo: "3 min", dificuldade: "Facil" },
  { id: "11", titulo: "Adicionar atividade secundaria", categoria: "Cadastro", tempo: "7 min", dificuldade: "Medio" },
  { id: "12", titulo: "Recuperando senha do Gov.br", categoria: "Outros", tempo: "4 min", dificuldade: "Facil" },
  { id: "13", titulo: "Aposentadoria por idade do MEI", categoria: "Beneficios", tempo: "11 min", dificuldade: "Medio" },
  { id: "14", titulo: "Erros comuns na emissao de NFS-e", categoria: "NFS-e", tempo: "7 min", dificuldade: "Medio" },
  { id: "15", titulo: "Baixar MEI: como dar baixa no CNPJ", categoria: "Cadastro", tempo: "10 min", dificuldade: "Medio" }
];
var atalhosGov = [
  { id: "1", nome: "PGMEI", desc: "Geracao e pagamento do DAS", categoria: "Impostos", url: "https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/" },
  { id: "2", nome: "Portal do Simples Nacional", desc: "DASN-SIMEI e parcelamentos", categoria: "Impostos", url: "https://www8.receita.fazenda.gov.br/SimplesNacional/" },
  { id: "3", nome: "Redesim", desc: "Abertura e alteracao de empresa", categoria: "Cadastro", url: "https://www.gov.br/empresas-e-negocios/pt-br/redesim" },
  { id: "4", nome: "e-CAC", desc: "Centro virtual da Receita Federal", categoria: "Impostos", url: "https://cav.receita.fazenda.gov.br/" },
  { id: "5", nome: "Portal NFS-e Nacional", desc: "Emissao de notas fiscais de servico", categoria: "Notas Fiscais", url: "https://www.nfse.gov.br/" },
  { id: "6", nome: "Meu INSS", desc: "Beneficios previdenciarios", categoria: "Beneficios", url: "https://meu.inss.gov.br/" },
  { id: "7", nome: "Portal do Empreendedor", desc: "Cadastro e CCMEI", categoria: "Cadastro", url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" }
];
var adminMetricas = {
  totalUsuarios: 1247,
  ativosHoje: 89,
  dasCalculados: 982,
  nfseEmitidas: 3142,
  crescimento: (function() {
    var arr = [];
    var hoje = new Date();
    for (var i = 0; i < 6; i++) {
      var d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);
      var m = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
      arr.push({ mes: m, usuarios: 600 + i * 130 + Math.round(Math.random() * 50) });
    }
    return arr;
  })(),
  topFeatures: [
    { nome: "Calculadora DAS", usos: 4821 },
    { nome: "Emissao NFS-e", usos: 3142 },
    { nome: "Calendario fiscal", usos: 2890 },
    { nome: "Tutoriais", usos: 2110 },
    { nome: "Simulador desenquadramento", usos: 1280 }
  ]
};
var usuariosAdmin = (function() {
  var arr = [];
  var nomes = ["Maria da Silva", "Joao Santos", "Ana Pereira", "Carlos Lima", "Beatriz Souza", "Rafael Costa", "Juliana Alves", "Marcos Rocha"];
  var hoje = new Date();
  for (var i = 0; i < 24; i++) {
    var dt = new Date(hoje.getFullYear(), hoje.getMonth() - (i % 12), 1 + (i % 28));
    arr.push({
      id: String(i + 1),
      nome: nomes[i % 8] + " " + (i + 1),
      email: "usuario" + (i + 1) + "@email.com",
      cnpj: String(10 + i).padStart(2, "0") + ".345.678/0001-" + String(10 + i).padStart(2, "0"),
      cadastro: dt.toLocaleDateString("pt-BR"),
      ultimoAcesso: "ha " + ((i % 9) + 1) + " dias",
      status: i % 7 === 0 ? "Inativo" : "Ativo"
    });
  }
  return arr;
})();
