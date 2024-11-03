import env from 'env-var';

export const redisConfig = {
    host: env.get('REDIS_HOST').default('0.0.0.0').asString(),
    port: env.get('REDIS_PORT').default(6379).asInt()
};
