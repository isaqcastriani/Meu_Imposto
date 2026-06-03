import { Router } from 'express';
import { many, one } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/http.js';
import { calcularDAS, vencimentoDAS, competenciaDoMes } from '../services/das.js';

export const dasRouter = Router();
dasRouter.use(autenticar);

async function tipoDoUsuario(userId) {
  const p = await one('select tipo from perfis_mei where user_id=$1', [userId]);
  return p?.tipo || 'Servicos';
}

// GET /api/das/atual  -> calcula o DAS do mes corrente (sem persistir)
dasRouter.get('/atual', asyncHandler(async (req, res) => {
  const tipo = await tipoDoUsuario(req.user.id);
  const calc = calcularDAS(tipo);
  const comp = competenciaDoMes();
  const venc = vencimentoDAS(comp);
  res.json({
    competencia: comp.toISOString().slice(0, 10),
    vencimento: venc.toISOString().slice(0, 10),
    tipo,
    ...calc,
  });
}));

// GET /api/das/historico -> guias geradas/pagas
dasRouter.get('/historico', asyncHandler(async (req, res) => {
  const guias = await many(
    `select id, competencia, vencimento, valor, inss, iss, icms, status
       from das_guias where user_id=$1 order by competencia desc`,
    [req.user.id]
  );
  res.json({ guias });
}));

// POST /api/das/gerar  -> gera (persiste) a guia do mes corrente
dasRouter.post('/gerar', asyncHandler(async (req, res) => {
  const tipo = await tipoDoUsuario(req.user.id);
  const calc = calcularDAS(tipo);
  const comp = competenciaDoMes(req.body?.competencia ? new Date(req.body.competencia) : new Date());
  const venc = vencimentoDAS(comp);

  const guia = await one(
    `insert into das_guias (user_id, competencia, vencimento, valor, inss, iss, icms, status)
     values ($1,$2,$3,$4,$5,$6,$7,'pendente')
     on conflict (user_id, competencia) do update set
       vencimento = excluded.vencimento, valor = excluded.valor,
       inss = excluded.inss, iss = excluded.iss, icms = excluded.icms
     returning id, competencia, vencimento, valor, inss, iss, icms, status`,
    [req.user.id, comp.toISOString().slice(0, 10), venc.toISOString().slice(0, 10),
     calc.total, calc.inss, calc.iss, calc.icms]
  );
  res.status(201).json({ guia });
}));

// POST /api/das/:id/pagar
dasRouter.post('/:id/pagar', asyncHandler(async (req, res) => {
  const guia = await one(
    `update das_guias set status='pago' where id=$1 and user_id=$2
     returning id, competencia, status`,
    [req.params.id, req.user.id]
  );
  if (!guia) throw new ApiError(404, 'Guia nao encontrada');
  res.json({ guia });
}));
