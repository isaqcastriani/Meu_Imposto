import { config } from '../config.js';

/**
 * Simula o impacto de ultrapassar o teto do MEI (R$ 81.000/ano).
 * Regra simplificada para fins didaticos:
 *  - Ate 20% acima do teto (<= R$ 97.200): desenquadramento no ano seguinte.
 *  - Acima de 20%: desenquadramento retroativo ao inicio do ano.
 *  - Estima migracao para Simples Nacional (aliquota inicial aproximada por tipo).
 */
export function simularDesenquadramento(faturamento, tipo = 'Servicos') {
  const teto = config.tetoMEI;
  const limiteTolerancia = teto * 1.2; // 97.200
  const excedente = Math.max(0, faturamento - teto);
  const percentTeto = Number(((faturamento / teto) * 100).toFixed(1));

  // Aliquotas iniciais aproximadas do Simples Nacional por anexo
  const aliquotas = {
    Comercio: 0.04, // Anexo I
    Industria: 0.045, // Anexo II
    Servicos: 0.06, // Anexo III
    'Comercio e Servicos': 0.06,
  };
  const aliquota = aliquotas[tipo] ?? 0.06;

  let situacao;
  let quando;
  if (faturamento <= teto) {
    situacao = 'dentro_do_teto';
    quando = 'Nenhuma acao necessaria';
  } else if (faturamento <= limiteTolerancia) {
    situacao = 'desenquadramento_ano_seguinte';
    quando = 'A partir de 1 de janeiro do proximo ano';
  } else {
    situacao = 'desenquadramento_retroativo';
    quando = 'Retroativo a 1 de janeiro do ano corrente';
  }

  const impostoEstimadoSimples = Number((faturamento * aliquota).toFixed(2));
  const dasAnualMEI = Number((calcDasAnual(tipo)).toFixed(2));

  return {
    faturamento,
    teto,
    percentTeto,
    excedente: Number(excedente.toFixed(2)),
    situacao,
    quando,
    novoRegime: 'Simples Nacional',
    aliquotaEstimada: aliquota,
    impostoAnualEstimadoSimples: impostoEstimadoSimples,
    impostoAnualMEI: dasAnualMEI,
    diferencaAnual: Number((impostoEstimadoSimples - dasAnualMEI).toFixed(2)),
    passos: [
      'Comunicar o desenquadramento no Portal do Simples Nacional (e-CAC).',
      'Solicitar enquadramento como ME no Simples Nacional.',
      'Contratar contador para apuracao mensal (PGDAS-D).',
      'Atualizar emissao de notas e obrigacoes acessorias.',
    ],
  };
}

function calcDasAnual(tipo) {
  const inss = config.salarioMinimo * 0.05;
  let extra = 5; // servicos
  if (tipo === 'Comercio' || tipo === 'Industria') extra = 1;
  if (tipo === 'Comercio e Servicos') extra = 6;
  return (inss + extra) * 12;
}
