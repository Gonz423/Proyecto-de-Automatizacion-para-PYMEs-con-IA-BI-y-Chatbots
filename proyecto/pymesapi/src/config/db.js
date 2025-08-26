// src/config/db.js
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// Permite usar DATABASE_URL (Heroku/Railway/etc) o variables separadas en local
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'pymes',
      // ssl: { rejectUnauthorized: false }, // habilita si tu proveedor lo requiere
    });

// Consulta simple (compatibilidad con código existente: db.query(...))
export async function query(text, params) {
  return pool.query(text, params);
}

// Obtiene un cliente para transacciones: const client = await db.getClient();
export async function getClient() {
  return pool.connect();
}

// Export por defecto con las 3 APIs
export default { query, getClient, pool };
