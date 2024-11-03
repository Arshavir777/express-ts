import 'reflect-metadata';
import { registerEnv } from '../src/utils';

export default async () => {
    registerEnv('.env.test');
  };

  
// dotenv.config({ path: , debug: true });

// // Define your database client
// let client: Sql;

// beforeAll(async () => {
//     // Initialize database connection before all tests
//     client = postgres({
//         host: process.env.DB_HOST,
//         port: parseInt(process.env.DB_PORT || '5432'),
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//     });
//     console.log('Database connected');

//     await runMigrations()
// });

// beforeEach(async () => {
//     // Ensure tables are truncated to reset their state
//     await client`TRUNCATE TABLE users, items, purchases RESTART IDENTITY CASCADE`;
// });

// afterAll(async () => {
//     // Close the database connection after all tests
//     await client.end();
//     console.log('Database connection closed');
// });
