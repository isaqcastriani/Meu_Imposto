import { Router } from 'express';
import { z } from 'zod';
import { many, one } from '../db.js';
import { autenticar, exigirAdmin } from '../middleware/auth.js';
import { asyncHandler, validate, ApiError } from '../utils/http.js';

export const adminRouter = Router();
adminRouter.use(autenticar, exigirAdmin);

adminRouter.get('/metricas', asyncHandler(async (_req, res) => {
  const totais = await one(
    `select
       (select count(*) from usuarios where role='mei') as total_usuarios,
       (select count(*) from usuarios where last_login >= now() - interval '1 day') as ativos_hoje,
       (select count(*) from das_guias) as das_calculados,
       (select count(*) from nfse where status='emitida') as nfse_emitidas`
  );

  const crescimento = await many(
    `with meses as (
        select to_char(d,'YYYY-MM') ym, to_char(d,'TMMon') rotulo
          from generate_series(date_trunc('month', now()) - interval '5 months',
                               date_trunc('month', now()), interval '1 month') d)
     select m.rotulo as mes, count(u.id)::int as usuarios
       from meses m
       left join usuarios u on to_char(u.created_at,'YYYY-MM') <= m.ym
      group by m.ym, m.rotulo order by m.ym`
  );

  res.json({
    totalUsuarios: Number(totais.total_usuarios),
    ativosHoje: Number(totais.ativos_hoje),
    dasCalculados: Number(totais.das_calculados),
    nfseEmitidas: Number(totais.nfse_emitidas),
    crescimento,
  });
}));

adminRouter.get('/usuarios', asyncHandler(async (_req, res) => {
  const usuarios = await many(
    `select u.id, u.nome, u.email, u.status, u.created_at, u.last_login, p.cnpj
       from usuarios u left join perfis_mei p on p.user_id=u.id
      where u.role='mei' order by u.created_at desc`
  );
  res.json({ usuarios });
}));

adminRouter.patch('/usuarios/:id/status', asyncHandler(async (req, res) => {
  const { status } = validate(z.object({ status: z.enum(['ativo', 'inativo']) }), req.body);
  const u = await one(
    'update usuarios set status=$1 where id=$2 and role=\'mei\' returning id, status',
    [status, req.params.id]
  );
  if (!u) throw new ApiError(404, 'Usuario nao encontrado');
  res.json({ usuario: u });
}));

const tutorialSchema = z.object({
  titulo: z.string().min(2),
  categoria: z.string().min(1),
  tempo: z.string().optional(),
  dificuldade: z.enum(['Facil', 'Medio', 'Dificil']).default('Facil'),
  conteudo: z.string().optional(),
});

adminRouter.post('/tutoriais', asyncHandler(async (req, res) => {
  const d = validate(tutorialSchema, req.body);
  const t = await one(
    `insert into tutoriais (titulo, categoria, tempo, dificuldade, conteudo)
     values ($1,$2,$3,$4,$5) returning *`,
    [d.titulo, d.categoria, d.tempo, d.dificuldade, d.conteudo]
  );
  res.status(201).json({ tutorial: t });
}));

adminRouter.put('/tutoriais/:id', asyncHandler(async (req, res) => {
  const d = validate(tutorialSchema, req.body);
  const t = await one(
    `update tutoriais set titulo=$1, categoria=$2, tempo=$3, dificuldade=$4, conteudo=$5
      where id=$6 returning *`,
    [d.titulo, d.categoria, d.tempo, d.dificuldade, d.conteudo, req.params.id]
  );
  if (!t) throw new ApiError(404, 'Tutorial nao encontrado');
  res.json({ tutorial: t });
}));

adminRouter.delete('/tutoriais/:id', asyncHandler(async (req, res) => {
  const t = await one('delete from tutoriais where id=$1 returning id', [req.params.id]);
  if (!t) throw new ApiError(404, 'Tutorial nao encontrado');
  res.json({ mensagem: 'Tutorial removido' });
}));

const atalhoSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  url: z.string().url(),
  ordem: z.coerce.number().int().default(0),
});

adminRouter.post('/atalhos', asyncHandler(async (req, res) => {
  const d = validate(atalhoSchema, req.body);
  const a = await one(
    `insert into atalhos_gov (nome, descricao, categoria, url, ordem)
     values ($1,$2,$3,$4,$5) returning *`,
    [d.nome, d.descricao, d.categoria, d.url, d.ordem]
  );
  res.status(201).json({ atalho: a });
}));

adminRouter.put('/atalhos/:id', asyncHandler(async (req, res) => {
  const d = validate(atalhoSchema, req.body);
  const a = await one(
    `update atalhos_gov set nome=$1, descricao=$2, categoria=$3, url=$4, ordem=$5
      where id=$6 returning *`,
    [d.nome, d.descricao, d.categoria, d.url, d.ordem, req.params.id]
  );
  if (!a) throw new ApiError(404, 'Atalho nao encontrado');
  res.json({ atalho: a });
}));

adminRouter.delete('/atalhos/:id', asyncHandler(async (req, res) => {
  const a = await one('delete from atalhos_gov where id=$1 returning id', [req.params.id]);
  if (!a) throw new ApiError(404, 'Atalho nao encontrado');
  res.json({ mensagem: 'Atalho removido' });
}));
