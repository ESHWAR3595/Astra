// server.js
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./config/db'); // PostgreSQL connection pool
const authController = require('./controllers/authController'); // Auth controller
const authMiddleware = require('./middlewares/authMiddleware'); // Auth middleware
const Product = require('./models/Product');
const cors = require('cors'); // Import CORS
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  credentials: true // Allow credentials (cookies, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Session configuration
app.use(
  session({
    store: new pgSession({
      pool: pool, // Connection pool
      tableName: 'session', // Table to store session data
    }),
    secret: process.env.SESSION_SECRET, // Secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', authMiddleware, authController.logout);
app.get('/check-session', authController.checkSession);
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products); // Send the product data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
