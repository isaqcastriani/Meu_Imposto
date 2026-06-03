import { config } from '../config.js';

/**
 * Calcula o valor do DAS-MEI conforme o tipo de atividade.
 * INSS = 5% do salario minimo. Comercio/Industria + R$1 (ICMS). Servicos + R$5 (ISS).
 */
export function calcularDAS(tipo = 'Servicos') {
  const inss = Number((config.salarioMinimo * 0.05).toFixed(2));
  let icms = 0;
  let iss = 0;
  switch (tipo) {
    case 'Comercio':
    case 'Industria':
      icms = 1;
      break;
    case 'Servicos':
      iss = 5;
      break;
    case 'Comercio e Servicos':
      icms = 1;
      iss = 5;
      break;
    default:
      iss = 5;
  }
  const total = Number((inss + icms + iss).toFixed(2));
  return { inss, icms, iss, total };
}

/** Data de vencimento do DAS: dia 20 do mes seguinte a competencia. */
export function vencimentoDAS(competencia) {
  const d = new Date(competencia);
  return new Date(d.getFullYear(), d.getMonth() + 1, 20);
}

/** Primeiro dia do mes (competencia) a partir de uma data. */
export function competenciaDoMes(data = new Date()) {
  const d = new Date(data);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
