import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { pool } from './db.js';
import { notFound, errorHandler } from './middleware/error.js';

import { authRouter } from './routes/auth.js';
import { perfilRouter } from './routes/perfil.js';
import { lancamentosRouter } from './routes/lancamentos.js';
import { financeiroRouter } from './routes/financeiro.js';
import { dasRouter } from './routes/das.js';
import { nfseRouter } from './routes/nfse.js';
import { calendarioRouter } from './routes/calendario.js';
import { conteudoRouter } from './routes/conteudo.js';
import { alertasRouter } from './routes/alertas.js';
import { ferramentasRouter } from './routes/ferramentas.js';
import { adminRouter } from './routes/admin.js';

const app = express();

app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',') }));
app.use(express.json());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Rate limit basico nas rotas de autenticacao
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });

// Healthcheck
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('select 1');
    res.json({ ok: true, db: 'conectado', env: config.env });
  } catch (e) {
    res.status(503).json({ ok: false, db: 'desconectado', erro: e.message });
  }
});

// Rotas
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/perfil', perfilRouter);
app.use('/api/lancamentos', lancamentosRouter);
app.use('/api/financeiro', financeiroRouter);
app.use('/api/das', dasRouter);
app.use('/api/nfse', nfseRouter);
app.use('/api/calendario', calendarioRouter);
app.use('/api', conteudoRouter);       // /api/tutoriais, /api/atalhos
app.use('/api/alertas', alertasRouter);
app.use('/api', ferramentasRouter);    // /api/cnpj/:cnpj, /api/simulador, /api/beneficios
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`\n  Meu Imposto API rodando em http://localhost:${config.port}`);
  console.log(`  Ambiente: ${config.env}`);
  console.log(`  Healthcheck: http://localhost:${config.port}/api/health\n`);
});
