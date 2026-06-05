import { config } from '../config.js';

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

export function vencimentoDAS(competencia) {
  const d = new Date(competencia);
  return new Date(d.getFullYear(), d.getMonth() + 1, 20);
}

export function competenciaDoMes(data = new Date()) {
  const d = new Date(data);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
