import { neon } from "@neondatabase/serverless";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Please define the DATABASE_URL environment variable");
  }

  return databaseUrl;
}

function getSqlClient() {
  if (!globalThis.__todoNeonSql) {
    globalThis.__todoNeonSql = neon(getDatabaseUrl());
  }

  return globalThis.__todoNeonSql;
}

export function sql(strings, ...params) {
  return getSqlClient()(strings, ...params);
}

async function initializeSchema() {
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL,
      email text NOT NULL UNIQUE,
      password text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name text NOT NULL,
      description text,
      status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'inProgress', 'done')),
      priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE items
    ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium'
  `;

  await sql`CREATE INDEX IF NOT EXISTS items_user_id_idx ON items (user_id)`;
}

export async function ensureDatabase() {
  if (!globalThis.__todoDatabaseInitPromise) {
    globalThis.__todoDatabaseInitPromise = initializeSchema();
  }

  return globalThis.__todoDatabaseInitPromise;
}
