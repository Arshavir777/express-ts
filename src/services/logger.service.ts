import { Service } from 'typedi';
import winston from 'winston';

@Service()
export class LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            // TODO: configure for production
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/app.log' })
            ],
        });
    }

    public logInfo(message: string): void {
        this.logger.info(message);
    }

    public logError(message: string): void {
        this.logger.error(message);
    }

    public logDebug(message: string): void {
        this.logger.debug(message);
    }
}
