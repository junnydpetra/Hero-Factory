import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'hero_user',
    password: process.env.DB_PASS || 'hero_password',
    database: process.env.DB_NAME || 'hero_factory',
    waitForConnections: true,
});