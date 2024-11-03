import { Container } from 'typedi';
import Bull from 'bull';
import { redisConfig } from '../config/redis.config';

export const ITEM_SYNC_QUEUE = 'bull-service:itemSyncQueue';

export function createSkinPortItemsSyncQueue() {
    let queue = Container.has(ITEM_SYNC_QUEUE)
        ? Container.get<Bull.Queue>(ITEM_SYNC_QUEUE)
        : null;

    if (!queue) {
        queue = new Bull('itemSyncQueue', {
            redis: redisConfig,
        });
        Container.set(ITEM_SYNC_QUEUE, queue);
    }

    return queue;
}

export default createSkinPortItemsSyncQueue;
