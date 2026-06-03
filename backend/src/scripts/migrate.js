import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from '../db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const sql = await readFile(join(__dirname, '../../sql/schema.sql'), 'utf8');
  console.log('[migrate] Aplicando schema...');
  await pool.query(sql);
  console.log('[migrate] Schema aplicado com sucesso.');
  await pool.end();
}

main().catch((e) => {
  console.error('[migrate] Falhou:', e.message);
  process.exit(1);
});
