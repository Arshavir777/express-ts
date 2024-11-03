import env from 'env-var';

export const dbConfig = {
    host: env.get('DB_HOST').default('0.0.0.0').asString(),
    port: env.get('DB_PORT').default(5432).asInt(),
    database: env.get('DB_NAME').default('mydb').asString(),
    user: env.get('DB_USER').default('admin').asString(),
    password: env.get('DB_PASSWORD').default('admin').asString(),
};
