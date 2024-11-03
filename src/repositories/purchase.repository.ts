import { Sql } from 'postgres';
import { PostgresDataSource } from '../datasources';
import { Service as Repository } from 'typedi';
import { Purchase } from '../model/purchase.model';
import { CreatePurchaseDTO } from '../dto';

@Repository()
export class PurchaseRepository {
  private sql: Sql;

  constructor(protected dataSource: PostgresDataSource) {
    this.sql = dataSource.getConnection();
  }

  async findById(id: number): Promise<Purchase> {
    const [purchase] = await this.sql<Purchase[]>`
      SELECT *
      FROM purchases
      WHERE id = ${id}
    `;
    return purchase;
  }

  async createPurchase(tx: Sql, dto: CreatePurchaseDTO): Promise<Purchase> {
    const { itemId, userId, quantity, totalPrice, isTradable } = dto;
    const [purchase] = await tx<Purchase[]>`
      INSERT INTO purchases(item_id, user_id, quantity, total_price, is_tradable)
      VALUES(${itemId}, ${userId}, ${quantity}, ${totalPrice}, ${isTradable})
      RETURNING *;
    `;

    return purchase
  }
}
