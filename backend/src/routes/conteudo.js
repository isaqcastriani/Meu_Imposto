import { Router } from 'express';
import { many, one } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/http.js';

export const conteudoRouter = Router();
conteudoRouter.use(autenticar);

conteudoRouter.get('/tutoriais', asyncHandler(async (req, res) => {
  const { categoria } = req.query;
  const params = [];
  let where = '';
  if (categoria) { params.push(categoria); where = 'where categoria = $1'; }
  const tutoriais = await many(
    `select id, titulo, categoria, tempo, dificuldade from tutoriais ${where} order by titulo`,
    params
  );
  res.json({ tutoriais });
}));

conteudoRouter.get('/tutoriais/:id', asyncHandler(async (req, res) => {
  const tutorial = await one('select * from tutoriais where id=$1', [req.params.id]);
  if (!tutorial) throw new ApiError(404, 'Tutorial nao encontrado');
  res.json({ tutorial });
}));

conteudoRouter.get('/atalhos', asyncHandler(async (_req, res) => {
  const atalhos = await many(
    'select id, nome, descricao, categoria, url from atalhos_gov order by ordem, nome'
  );
  res.json({ atalhos });
}));
