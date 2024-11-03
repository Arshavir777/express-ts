import { createClient } from 'redis';
import { Service } from 'typedi';
import { LoggerService } from '../services';

@Service()
export class RedisProvider {
    private client;

    constructor(protected logger: LoggerService) {
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        });

        this.client.on('error', (err) => this.logger.logError(`Redis Client Error: ${err.message}`));
        this.client.connect().then(() => this.logger.logInfo('Redis connected successfully'));
    }

    public getClient() {
        return this.client;
    }

    async set(key: string, value: string, expirationSeconds?: number) {
        if (expirationSeconds) {
            await this.client.set(key, value, { EX: expirationSeconds });
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async disconnect() {
        await this.client.quit();
    }
}
