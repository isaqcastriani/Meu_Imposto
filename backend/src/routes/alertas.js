import { Router } from 'express';
import { many, one } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/http.js';

export const alertasRouter = Router();
alertasRouter.use(autenticar);

// GET /api/alertas  -> alertas do usuario + globais
alertasRouter.get('/', asyncHandler(async (req, res) => {
  const alertas = await many(
    `select id, tipo, titulo, descricao, lida, created_at
       from alertas where user_id = $1 or user_id is null
      order by created_at desc limit 50`,
    [req.user.id]
  );
  res.json({ alertas });
}));

// POST /api/alertas/:id/lida
alertasRouter.post('/:id/lida', asyncHandler(async (req, res) => {
  const a = await one(
    `update alertas set lida = true where id=$1 and (user_id=$2 or user_id is null) returning id`,
    [req.params.id, req.user.id]
  );
  if (!a) throw new ApiError(404, 'Alerta nao encontrado');
  res.json({ mensagem: 'Alerta marcado como lido' });
}));
