import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

import { dbConfig } from './config/database';

const sql = postgres(dbConfig);

async function seedUsers() {
    const users = [
        {
            email: 'admin@gmail.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'dsfdsf',
        }
    ];

    try {
        await Promise.all(
            users.map((user) => sql`
            INSERT INTO users (email, first_name, last_name, password)
            VALUES (${user.email}, ${user.first_name}, ${user.last_name}, ${user.password})
            ON CONFLICT (email) DO NOTHING;
        `)
        );
        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sql.end();
    }
}

// Run the seed function
seedUsers();
