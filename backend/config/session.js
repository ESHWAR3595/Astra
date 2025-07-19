const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: 'lax'
  },
  name: 'astra-session'
};

module.exports = sessionConfig; 