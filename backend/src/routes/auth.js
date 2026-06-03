import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { one } from '../db.js';
import { transaction } from '../db.js';
import { signToken, autenticar } from '../middleware/auth.js';
import { asyncHandler, validate, ApiError } from '../utils/http.js';

export const authRouter = Router();

const registroSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
  razaoSocial: z.string().optional(),
  cnae: z.string().optional(),
  cnaeDesc: z.string().optional(),
  tipo: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

function publico(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role, status: usuario.status };
}

// POST /api/auth/register
authRouter.post('/register', asyncHandler(async (req, res) => {
  const dados = validate(registroSchema, req.body);
  const existe = await one('select id from usuarios where email = $1', [dados.email]);
  if (existe) throw new ApiError(409, 'Ja existe um usuario com este e-mail');

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  const usuario = await transaction(async (client) => {
    const { rows } = await client.query(
      `insert into usuarios (nome, email, senha_hash, role)
       values ($1, $2, $3, 'mei')
       returning id, nome, email, role, status`,
      [dados.nome, dados.email, senhaHash]
    );
    const u = rows[0];
    await client.query(
      `insert into perfis_mei (user_id, cpf, telefone, razao_social, cnpj, cnae, cnae_desc, tipo)
       values ($1, $2, $3, $4, $5, $6, $7, coalesce($8, 'Servicos'))`,
      [u.id, dados.cpf, dados.telefone, dados.razaoSocial, dados.cnpj, dados.cnae, dados.cnaeDesc, dados.tipo]
    );
    return u;
  });

  const token = signToken(usuario);
  res.status(201).json({ token, usuario: publico(usuario) });
}));

// POST /api/auth/login
authRouter.post('/login', asyncHandler(async (req, res) => {
  const dados = validate(loginSchema, req.body);
  const usuario = await one('select * from usuarios where email = $1', [dados.email]);
  if (!usuario) throw new ApiError(401, 'E-mail ou senha invalidos');
  if (usuario.status === 'inativo') throw new ApiError(403, 'Conta desativada');

  const ok = await bcrypt.compare(dados.senha, usuario.senha_hash);
  if (!ok) throw new ApiError(401, 'E-mail ou senha invalidos');

  await one('update usuarios set last_login = now() where id = $1 returning id', [usuario.id]);
  const token = signToken(usuario);
  res.json({ token, usuario: publico(usuario) });
}));

// GET /api/auth/me
authRouter.get('/me', autenticar, asyncHandler(async (req, res) => {
  const usuario = await one('select id, nome, email, role, status from usuarios where id = $1', [req.user.id]);
  if (!usuario) throw new ApiError(404, 'Usuario nao encontrado');
  res.json({ usuario: publico(usuario) });
}));

// POST /api/auth/recuperar-senha  (stub: gera token de reset; envio de e-mail fora do escopo)
authRouter.post('/recuperar-senha', asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '');
  // Nao revela se o e-mail existe (boa pratica de seguranca)
  res.json({ mensagem: 'Se o e-mail estiver cadastrado, enviaremos instrucoes de recuperacao.' });
}));
