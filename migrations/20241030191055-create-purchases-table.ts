import { Sql } from 'postgres';

export async function up(db: Sql) {
  await db`
    CREATE TABLE purchases (
      id SERIAL PRIMARY KEY,
      item_id INT NOT NULL,
      is_tradable BOOLEAN DEFAULT false,
      user_id INT NOT NULL,
      quantity INT NOT NULL CHECK (quantity > 0),
      total_price NUMERIC(7, 2) NOT NULL,
      purchased_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (item_id) REFERENCES items (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;
}

export async function down(db: Sql) {
  await db`DROP TABLE IF EXISTS purchases;`;
}
