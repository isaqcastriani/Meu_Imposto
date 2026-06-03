import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

// Supabase exige SSL. O pooler usa certificado gerenciado; rejectUnauthorized:false
// evita erro de cadeia de certificados em ambiente local/dev.
export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[db] Erro inesperado no pool de conexoes:', err.message);
});

/** Executa uma query parametrizada e devolve as linhas. */
export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

/** Atalho que devolve a primeira linha (ou null). */
export async function one(text, params) {
  const res = await pool.query(text, params);
  return res.rows[0] || null;
}

/** Atalho que devolve todas as linhas. */
export async function many(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}

/** Roda uma funcao dentro de uma transacao. */
export async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
