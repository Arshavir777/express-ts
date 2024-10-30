import { Sql } from 'postgres';

export async function up(db: Sql) {
  await db`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function down(db: Sql) {
  await db`DROP TABLE IF EXISTS users;`;
}
