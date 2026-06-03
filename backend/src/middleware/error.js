import { ApiError } from '../utils/http.js';
import { config } from '../config.js';

/** 404 para rotas nao encontradas. */
export function notFound(_req, res) {
  res.status(404).json({ erro: 'Rota nao encontrada' });
}

/** Tratador central de erros. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ erro: err.message, detalhes: err.details });
  }
  // Violacao de unique do Postgres
  if (err.code === '23505') {
    return res.status(409).json({ erro: 'Registro ja existe' });
  }
  console.error('[erro]', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    ...(config.env === 'development' ? { debug: err.message } : {}),
  });
}
