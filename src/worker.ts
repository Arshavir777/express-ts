import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { LoggerService } from './services';
import Container from 'typedi';
import { createSkinPortItemsSyncQueue } from './jobs/sync-api-items.job';
import { RedisProvider } from './providers';
import { ItemsSyncService } from './services/items-sync.service';

const logger = Container.get(LoggerService);
const queue = createSkinPortItemsSyncQueue();

// Process the job in the worker
queue.process(async (job) => {
    const { cacheKey } = job.data;
    logger.logInfo('Running item sync job...',);

    const redisProvider = Container.get(RedisProvider);
    const itemsSyncService = Container.get(ItemsSyncService);

    const redisData = await redisProvider.get(cacheKey);
    if (!redisData) {
        return;
    }

    const items = JSON.parse(redisData);
    await itemsSyncService.storeSkinPortItems(items)
    logger.logInfo('Item sync job completed.');
});

queue.on('completed', (job) => {
    logger.logInfo(`Job ${job.id} completed successfully`);
});

queue.on('failed', (job, error) => {
    logger.logError(`Job ${job.id} failed: ${error.message}`);
});

logger.logInfo('Worker is ready and waiting for jobs...');
