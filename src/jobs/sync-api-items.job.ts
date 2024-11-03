import Bull from 'bull';
import { redisConfig } from '../config/redis.config';

const skinPortItemsSyncQueue = new Bull('itemSyncQueue', {
    redis: redisConfig,
});

export default skinPortItemsSyncQueue;
