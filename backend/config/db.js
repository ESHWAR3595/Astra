// config/db.js
const { Pool } = require('pg');
require('dotenv').config();
console.log('Password:', process.env.PGPASSWORD);
console.log('Password Type:', typeof process.env.PGPASSWORD);
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

module.exports = pool;
