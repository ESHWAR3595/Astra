// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // Use Railway's DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
} else {
  // Fallback to individual variables (for local development)
  const config = require('./environment');
  pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.name,
    password: config.database.password,
    port: config.database.port,
  });
}

module.exports = pool;
