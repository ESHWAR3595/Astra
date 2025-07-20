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
    secure: false, // Set to false for cross-origin
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: false, // Set to false to allow JavaScript access
    sameSite: 'none', // Allow cross-origin
    domain: undefined // Remove domain restriction
  },
  name: 'astra-session'
};

module.exports = sessionConfig; 