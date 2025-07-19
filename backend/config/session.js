const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: true, // Changed to true to ensure session is saved
  saveUninitialized: false,
  cookie: { 
    secure: false, // Changed to false for development and containerized environments
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: 'lax'
  },
  name: 'astra-session'
};

module.exports = sessionConfig; 