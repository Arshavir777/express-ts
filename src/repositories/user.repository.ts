import { Sql } from 'postgres';
import { PostgresDataSource } from '../datasources';
import { Service as Repository } from 'typedi';
import { User } from '../model';
import { HttpError } from 'routing-controllers';

@Repository()
export class UserRepository {
  private sql: Sql;

  constructor(private database: PostgresDataSource) {
    this.sql = database.getConnection();
  }

  async createUser(email: string, first_name: string, last_name: string, password: string): Promise<User> {
    const [newUser] = await this.sql<User[]>`
      INSERT INTO users (email, first_name, last_name, password)
      VALUES (${email}, ${first_name}, ${last_name}, ${password})
      RETURNING *
    `;
    return newUser;
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await this.sql<User[]>`
      SELECT *
      FROM users
      WHERE id = ${id}
    `;
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.sql<User[]>`
      SELECT *
      FROM users
      WHERE email = ${email}
    `;
    return user || null;
  }

  async updatePasswordById(id: number, hashedPassword: string): Promise<void> {
    await this.sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${id}
    `;
  }

  async decreaseBalance(tx: Sql, userId: number, amount: number): Promise<void> {
    const result = await tx`
      UPDATE users
      SET balance = balance - ${amount}
      WHERE id = ${userId} AND balance >= ${amount}
      RETURNING balance
    `;
    if (result.count === 0) {
      throw new HttpError(422, 'Insufficient balance');
    }
  }
}
