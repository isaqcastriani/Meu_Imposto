import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { ApiError } from '../utils/http.js';

export function signToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, role: usuario.role, email: usuario.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export function autenticar(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Token de autenticacao ausente'));
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, 'Token invalido ou expirado'));
  }
}

export function exigirAdmin(req, _res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Acesso restrito a administradores'));
  }
  next();
}
