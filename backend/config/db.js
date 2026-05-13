const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ override: true });

// Fallback to read .env manually if system env shadows it with empty string
let dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const match = envFile.match(/DB_PASSWORD=(.*)/);
        if (match && match[1]) {
            dbPassword = match[1].trim();
        }
    } catch (e) {
        console.error("Could not read .env manually", e);
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: dbPassword || '',
    database: process.env.DB_NAME || 'auction_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
