import { Router } from 'express';
import { z } from 'zod';
import { one, many } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, validate, ApiError } from '../utils/http.js';

export const lancamentosRouter = Router();
lancamentosRouter.use(autenticar);

const lancamentoSchema = z.object({
  data: z.string(),
  descricao: z.string().min(1),
  categoria: z.string().default('Outros'),
  tipo: z.enum(['receita', 'despesa']),
  valor: z.coerce.number().nonnegative(),
});

lancamentosRouter.get('/', asyncHandler(async (req, res) => {
  const { tipo, de, ate } = req.query;
  const cond = ['user_id = $1'];
  const params = [req.user.id];
  if (tipo) { params.push(tipo); cond.push(`tipo = $${params.length}`); }
  if (de) { params.push(de); cond.push(`data >= $${params.length}`); }
  if (ate) { params.push(ate); cond.push(`data <= $${params.length}`); }

  const lancamentos = await many(
    `select id, data, descricao, categoria, tipo, valor
       from lancamentos where ${cond.join(' and ')}
      order by data desc, created_at desc`,
    params
  );
  res.json({ lancamentos });
}));

lancamentosRouter.post('/', asyncHandler(async (req, res) => {
  const d = validate(lancamentoSchema, req.body);
  const lanc = await one(
    `insert into lancamentos (user_id, data, descricao, categoria, tipo, valor)
     values ($1,$2,$3,$4,$5,$6)
     returning id, data, descricao, categoria, tipo, valor`,
    [req.user.id, d.data, d.descricao, d.categoria, d.tipo, d.valor]
  );
  res.status(201).json({ lancamento: lanc });
}));

lancamentosRouter.put('/:id', asyncHandler(async (req, res) => {
  const d = validate(lancamentoSchema, req.body);
  const lanc = await one(
    `update lancamentos set data=$1, descricao=$2, categoria=$3, tipo=$4, valor=$5
      where id=$6 and user_id=$7
      returning id, data, descricao, categoria, tipo, valor`,
    [d.data, d.descricao, d.categoria, d.tipo, d.valor, req.params.id, req.user.id]
  );
  if (!lanc) throw new ApiError(404, 'Lancamento nao encontrado');
  res.json({ lancamento: lanc });
}));

lancamentosRouter.delete('/:id', asyncHandler(async (req, res) => {
  const lanc = await one(
    'delete from lancamentos where id=$1 and user_id=$2 returning id',
    [req.params.id, req.user.id]
  );
  if (!lanc) throw new ApiError(404, 'Lancamento nao encontrado');
  res.json({ mensagem: 'Lancamento removido' });
}));
