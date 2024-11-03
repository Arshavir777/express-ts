# Express-TS REST API

A Node.js project using TypeScript, PM2, Bull, and Redis for an efficient API and background job processing setup.

## Features

- **TypeScript** for type-safe development.
- **TypeDI** for DI
- **PM2** for efficient process management and monitoring.
- **Bull** for background job processing.
- **Redis** for caching and job queue management.
- **ExpressSession-Redis-connection** for session management
- **Database Migrations** and **Seeding** handled before application start.
- **Docker** support for containerization and easy deployment.
- **Routing-Controllers** for cleaner and more organized route handling.
- **Integration with Redis and Job Queues**.
- **DB Transaction**

## Technologies

- **Express.js**
- **TypeScript**
- **PM2**
- **Winston** for logging
- **Bull**
- **Redis**
- **Postgres.js** for database interaction
- **Docker** and **Docker Compose**
- **Jest** for testing

### Production RUN

```
docker-compose up -d
```

### Development RUN

```
# Update .env
# NODE_ENV=development
# DB_HOST=0.0.0.0
# REDIS_HOST=0.0.0.0

npm i
npm run build
npm run dev

# Start worker for queue-jobs
npm run worker
```

## DB Migration & Seed (OPTIONAL: Will run on docker startup)

```
npm run migrate
npm run seed
```

## API (Swagger) Docs and Endpoints

Cookie authorization
http://localhost:3000/docs

### Admin email/password

email: admin@gmail.com
password: admin

POST: /api/auth/login

```
curl --location 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@gmail.com",
    "password": "admin"
}'
```

## Postman collection

- [Postman Collection](./pc.postman_collection.json)

## Automated tests: UNIT Tests

Covered only `item.service.ts` ... for example

```
npm run test
```
