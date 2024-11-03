import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { LoggerService } from './services';
import Container from 'typedi';

const logger = Container.get(LoggerService);

import itemSyncQueue from './jobs/sync-api-items.job'; // Your job queue
import { RedisProvider } from './providers';
import { ItemsSyncService } from './services/items-sync.service';

// Process the job in the worker
itemSyncQueue.process(async (job) => {
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

itemSyncQueue.on('completed', (job) => {
    logger.logInfo(`Job ${job.id} completed successfully`);
});

itemSyncQueue.on('failed', (job, error) => {
    logger.logError(`Job ${job.id} failed: ${error.message}`);
});

logger.logInfo('Worker is ready and waiting for jobs...');
