import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`[config] Variavel de ambiente obrigatoria ausente: ${name}`);
    console.error('Copie backend/.env.example para backend/.env e preencha os valores.');
    process.exit(1);
  }
  return v;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  salarioMinimo: Number(process.env.SALARIO_MINIMO || 1518),
  tetoMEI: 81000,
};
