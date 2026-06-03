import { Router } from 'express';
import { z } from 'zod';
import { one } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, validate } from '../utils/http.js';

export const perfilRouter = Router();
perfilRouter.use(autenticar);

// GET /api/perfil
perfilRouter.get('/', asyncHandler(async (req, res) => {
  const perfil = await one(
    `select u.id, u.nome, u.email, u.role, u.status, u.created_at,
            p.cpf, p.telefone, p.razao_social, p.nome_fantasia, p.cnpj,
            p.cnae, p.cnae_desc, p.tipo, p.abertura, p.situacao, p.endereco, p.teto
       from usuarios u
       left join perfis_mei p on p.user_id = u.id
      where u.id = $1`,
    [req.user.id]
  );
  res.json({ perfil });
}));

const updateSchema = z.object({
  nome: z.string().min(2).optional(),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().optional(),
  cnae: z.string().optional(),
  cnaeDesc: z.string().optional(),
  tipo: z.enum(['Servicos', 'Comercio', 'Industria', 'Comercio e Servicos']).optional(),
  abertura: z.string().optional(),
  situacao: z.string().optional(),
  endereco: z.string().optional(),
});

// PUT /api/perfil
perfilRouter.put('/', asyncHandler(async (req, res) => {
  const d = validate(updateSchema, req.body);
  if (d.nome) await one('update usuarios set nome = $1 where id = $2 returning id', [d.nome, req.user.id]);

  await one(
    `insert into perfis_mei (user_id, cpf, telefone, razao_social, nome_fantasia, cnpj, cnae, cnae_desc, tipo, abertura, situacao, endereco, updated_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,coalesce($9,'Servicos'),$10,$11,$12, now())
     on conflict (user_id) do update set
       cpf = coalesce(excluded.cpf, perfis_mei.cpf),
       telefone = coalesce(excluded.telefone, perfis_mei.telefone),
       razao_social = coalesce(excluded.razao_social, perfis_mei.razao_social),
       nome_fantasia = coalesce(excluded.nome_fantasia, perfis_mei.nome_fantasia),
       cnpj = coalesce(excluded.cnpj, perfis_mei.cnpj),
       cnae = coalesce(excluded.cnae, perfis_mei.cnae),
       cnae_desc = coalesce(excluded.cnae_desc, perfis_mei.cnae_desc),
       tipo = coalesce(excluded.tipo, perfis_mei.tipo),
       abertura = coalesce(excluded.abertura, perfis_mei.abertura),
       situacao = coalesce(excluded.situacao, perfis_mei.situacao),
       endereco = coalesce(excluded.endereco, perfis_mei.endereco),
       updated_at = now()
     returning user_id`,
    [req.user.id, d.cpf, d.telefone, d.razaoSocial, d.nomeFantasia, d.cnpj, d.cnae, d.cnaeDesc, d.tipo,
     d.abertura || null, d.situacao, d.endereco]
  );

  res.json({ mensagem: 'Perfil atualizado' });
}));
