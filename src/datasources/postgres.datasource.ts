import postgres, { Sql } from 'postgres';
import { Service } from 'typedi';
import { dbConfig } from '../config/database.config';
import { LoggerService } from '../services';

@Service() // Singleton
export class PostgresDataSource {
    private connection: Sql;

    /**
     *  Connections are created lazily once a query is created.
     */
    constructor(protected logger: LoggerService) {
        this.connection = postgres(dbConfig);
    }

    public async checkConnection(): Promise<void> {
        try {
            await this.connection`SELECT 1`;
            this.logger.logInfo('Database connected successfully');
        } catch (error: any) {
            this.logger.logError(`Failed to connect to the database: ${error.message}`);
            throw error;
        }
    }

    public getConnection(): postgres.Sql<any> {
        return this.connection;
    }

    public async closeConnection(): Promise<void> {
        await this.connection.end();
    }
}

export default PostgresDataSource;
