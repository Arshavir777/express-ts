import postgres, { Sql } from 'postgres';
import { Service } from 'typedi';
import { dbConfig } from '../config/database';

@Service()
export class PostgresDataSource {
    private pool: Sql;

    constructor() {
        this.pool = postgres(dbConfig);
    }

    public getPool(): Sql {
        return this.pool;
    }

    public async disconnect(): Promise<void> {
        await this.pool.end();
    }
}

export default PostgresDataSource;
