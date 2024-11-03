import { Sql } from 'postgres';
import { Service as Repository } from 'typedi';
import { Item } from '../model';
import { CreateItemDTO } from '../dto';
import { PostgresDataSource } from '../datasources';

@Repository()
export class ItemRepository {
    private sql: Sql;

    constructor(private database: PostgresDataSource) {
        this.sql = database.getConnection();
    }

    async findById(id: number): Promise<Item | null> {
        const [item] = await this.sql<Item[]>`
          SELECT *
          FROM items
          WHERE id = ${id}
        `;
        return item || null;
    }

    async createOne(dto: CreateItemDTO): Promise<Item | null> {
        const [item] = await this.sql<Item[]>`
          SELECT *
          FROM items
        `;
        return item || null;
    }

    async bulkCreate(items: CreateItemDTO[]): Promise<number> {
        // TODO: update prices if need
        const result = await this.sql`
          INSERT INTO items ${this.sql(items)}
          ON CONFLICT (name) DO NOTHING
        `;
        return result.count;
    }

    async decreaseQuantity(tx: Sql, itemId: number, quantity: number) {
        await tx`UPDATE items SET quantity = quantity - ${quantity} WHERE id = ${itemId}`
    }
}
