import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

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

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export async function one(text, params) {
  const res = await pool.query(text, params);
  return res.rows[0] || null;
}

export async function many(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}

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
