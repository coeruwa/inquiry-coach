import { neon } from '@neondatabase/serverless';

let tableReady = false;

export function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('データベースが未設定です。VercelのStorage/MarketplaceからNeon (Postgres) を接続し、DATABASE_URL を設定してください。');
  }
  return neon(url);
}

export async function ensureTable(sql) {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      class_name       TEXT NOT NULL DEFAULT '',
      topic            TEXT,
      step             INTEGER NOT NULL DEFAULT 0,
      turn_count       INTEGER NOT NULL DEFAULT 0,
      research_count   INTEGER NOT NULL DEFAULT 0,
      theme_card       JSONB,
      history          JSONB NOT NULL DEFAULT '[]',
      research_history JSONB NOT NULL DEFAULT '[]',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  tableReady = true;
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
}
