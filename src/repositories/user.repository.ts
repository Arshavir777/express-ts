import { User } from '../model';
import { PostgresDataSource } from '../datasources';
import { Sql } from 'postgres';
import { Service as Repository } from 'typedi';

@Repository()
export class UserRepository {
  private sql: Sql;

  constructor(private database: PostgresDataSource) {
    this.sql = database.getPool();
  }

  async createUser(username: string, email: string): Promise<User> {
    const [newUser]: [User] = await this.sql`
      INSERT INTO users (username, email)
      VALUES (${username}, ${email})
      RETURNING id, username, email, created_at
    `;
    return newUser;
  }

  async findById(id: number): Promise<User | null> {
    const [user]: [User] = await this.sql`
      SELECT id, email, first_name, last_name, created_at
      FROM users
      WHERE id = ${id}
    `;
    return user || null;
  }

  // Other CRUD methods as needed
}
