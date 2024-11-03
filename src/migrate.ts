import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { Sql } from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

import { dbConfig } from './config/database.config';

const sql = postgres(dbConfig);

async function getAppliedMigrations(db: Sql): Promise<string[]> {
  await db`CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW()
  );`;

  const result = await db<{ name: string }[]>`SELECT name FROM migrations ORDER BY applied_at DESC`;
  return result.map(row => row.name);
}

async function applyMigration(db: Sql, file: string) {
  const { up } = await import(path.join(__dirname, '../migrations', file));
  await up(db);
  await db`INSERT INTO migrations (name) VALUES (${file})`;
  console.log(`Applied migration: ${file}`);
}

async function revertMigration(db: Sql, file: string) {
  const { down } = await import(path.join(__dirname, '../migrations', file));
  if (typeof down === 'function') {
    await down(db);
    await db`DELETE FROM migrations WHERE name = ${file}`;
    console.log(`Reverted migration: ${file}`);
  } else {
    console.log(`No down function found for migration: ${file}`);
  }
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

async function runDownMigrations() {
  try {
    const appliedMigrations = await getAppliedMigrations(sql);

    for (const file of appliedMigrations) {
      await revertMigration(sql, file);
    }

    console.log('All migrations reverted.');
  } catch (error) {
    console.error('Error reverting migrations:', error);
  } finally {
    await sql.end();
  }
}

if (process.argv.includes('--down')) {
  runDownMigrations();
} else {
  runMigrations();
}
