import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

import { dbConfig } from './config/database.config';
import { Currency, Item, User } from './model';

const sql = postgres(dbConfig);
async function seedDB() {
    const users: Omit<User, 'id' | 'created_at'>[] = [
        {
            email: 'admin@gmail.com',
            first_name: 'John',
            last_name: 'Doe',
            password: '$2b$10$JLByCusGIFh1dyNzZ.dMr.hViR1DGTPkV8MnSvD7udf9tFT44AE5G', // admin
            balance: 2000
        }
    ];

    const items: Omit<Item, 'id' | 'created_at'>[] = [
        {
            name: 'Test Product',
            app_id: 730,
            currency: Currency.EUR,
            non_tradable_price: 20.00,
            tradable_price: 22.00,
            quantity: 100,
            item_page: 'https://google.com'
        }
    ];

    try {
        await sql`INSERT INTO users ${sql(users)} ON CONFLICT (email) DO NOTHING`
        console.log('Users seed data inserted successfully');

        await sql`INSERT INTO items ${sql(items)} ON CONFLICT (name) DO NOTHING`
        console.log('Items seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sql.end();
    }
}

seedDB();
