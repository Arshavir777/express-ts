import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { Sql } from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

import { dbConfig } from './config/database';

const sql = postgres(dbConfig);

async function getAppliedMigrations(db: Sql): Promise<string[]> {
  await db`CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW()
  );`;

  const result = await db<{ name: string }[]>`SELECT name FROM migrations`;
  return result.map(row => row.name);
}

async function applyMigration(db: Sql, file: string) {
  const { up } = await import(path.join(__dirname, '../migrations', file));
  await up(db);
  await db`INSERT INTO migrations (name) VALUES (${file})`;
  console.log(`Applied migration: ${file}`);
}

async function runMigrations() {
  try {
    const appliedMigrations = await getAppliedMigrations(sql);
    const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'))
      .filter(file => file.endsWith('.ts') && !appliedMigrations.includes(file));

    for (const file of migrationFiles) {
      await applyMigration(sql, file);
    }

    console.log('All migrations applied.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await sql.end();
  }
}

runMigrations();
