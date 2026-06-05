import { Router } from 'express';
import { z } from 'zod';
import { many, one } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, validate, ApiError } from '../utils/http.js';

export const nfseRouter = Router();
nfseRouter.use(autenticar);

const emitirSchema = z.object({
  tomador: z.string().min(2),
  tomadorDoc: z.string().optional(),
  descricao: z.string().optional(),
  valor: z.coerce.number().positive(),
  data: z.string().optional(),
});

nfseRouter.get('/', asyncHandler(async (req, res) => {
  const notas = await many(
    `select id, numero, data, tomador, tomador_doc, descricao, valor, status
       from nfse where user_id=$1 order by data desc, created_at desc`,
    [req.user.id]
  );
  res.json({ notas });
}));

nfseRouter.post('/', asyncHandler(async (req, res) => {
  const d = validate(emitirSchema, req.body);
  const ano = new Date().getFullYear();
  const seq = await one(
    `select count(*)::int + 1 as n from nfse where user_id=$1 and date_part('year', data)=$2`,
    [req.user.id, ano]
  );
  const numero = `${ano}${String(seq.n).padStart(6, '0')}`;

  const nota = await one(
    `insert into nfse (user_id, numero, data, tomador, tomador_doc, descricao, valor, status)
     values ($1,$2, coalesce($3, current_date), $4,$5,$6,$7,'emitida')
     returning id, numero, data, tomador, tomador_doc, descricao, valor, status`,
    [req.user.id, numero, d.data || null, d.tomador, d.tomadorDoc, d.descricao, d.valor]
  );
  res.status(201).json({ nota });
}));

nfseRouter.post('/:id/cancelar', asyncHandler(async (req, res) => {
  const nota = await one(
    `update nfse set status='cancelada' where id=$1 and user_id=$2 returning id, numero, status`,
    [req.params.id, req.user.id]
  );
  if (!nota) throw new ApiError(404, 'Nota nao encontrada');
  res.json({ nota });
}));
