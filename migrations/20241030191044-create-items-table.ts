import { Sql } from 'postgres';

export async function up(db: Sql) {
  await db`
    CREATE TABLE items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      app_id INTEGER NOT NULL,
      currency VARCHAR(5),
      tradable_price NUMERIC(7,2),
      non_tradable_price NUMERIC(7,2),
      item_page VARCHAR(500),
      quantity INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function down(db: Sql) {
  await db`DROP TABLE IF EXISTS items;`;
}
