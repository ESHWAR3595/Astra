const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./config/db'); // PostgreSQL connection pool
const authController = require('./controllers/authController'); // Auth controller
const authMiddleware = require('./middlewares/authMiddleware'); // Auth middleware
require('dotenv').config(); // Load environment variables
const cors = require('cors'); // Import CORS

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials (cookies, etc.)
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    store: new pgSession({
      pool: pool, // PostgreSQL connection pool
      tableName: 'session', // Table to store session data
    }),
    secret: process.env.SESSION_SECRET, // Secret key
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

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products'); // Replace with your query
    res.json(result.rows); // Send the product data as JSON
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Fetch product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the specific product data
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
