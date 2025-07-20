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
  resave: true,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production' ? false : false, // Set to false for Railway
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.railway.app' : undefined
  },
  name: 'astra-session'
};

module.exports = sessionConfig; 