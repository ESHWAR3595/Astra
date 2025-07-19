// config/db.js
const { Pool } = require('pg');
require('dotenv').config();
const config = require('./environment');

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.name,
  password: config.database.password,
  port: config.database.port,
});

module.exports = pool;
