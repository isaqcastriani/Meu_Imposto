import { Router } from 'express';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler } from '../utils/http.js';

export const calendarioRouter = Router();
calendarioRouter.use(autenticar);

// GET /api/calendario?ano=2026
// Gera as obrigacoes fiscais do MEI no ano: DAS mensal (dia 20) + DASN-SIMEI (31/05).
calendarioRouter.get('/', asyncHandler(async (req, res) => {
  const ano = Number(req.query.ano) || new Date().getFullYear();
  const obrigacoes = [];

  for (let mes = 0; mes < 12; mes++) {
    obrigacoes.push({
      data: new Date(ano, mes, 20).toISOString().slice(0, 10),
      titulo: 'DAS-MEI',
      tipo: 'das',
      descricao: 'Vencimento mensal do DAS',
    });
  }
  obrigacoes.push({
    data: new Date(ano, 4, 31).toISOString().slice(0, 10),
    titulo: 'DASN-SIMEI',
    tipo: 'anual',
    descricao: 'Declaracao Anual do Simples Nacional (obrigatoria)',
  });

  obrigacoes.sort((a, b) => a.data.localeCompare(b.data));
  res.json({ ano, obrigacoes });
}));
