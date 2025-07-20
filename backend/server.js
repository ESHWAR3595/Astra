require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const initDatabase = require('./config/initDb');

// Import configurations
const corsOptions = require('./config/cors');
const sessionConfig = require('./config/session');

// Import middleware
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(require('express-session')(sessionConfig));

// Logging middleware
app.use(logger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Astra E-Commerce API Documentation'
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Astra E-Commerce API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: {
        login: '/login',
        register: '/register',
        logout: '/logout',
        checkSession: '/check-session'
      },
      products: '/api/products',
      search: '/api/search'
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Astra API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
  try {
    const pool = require('./config/db');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      currentTime: result.rows[0].current_time,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });
  }
});

// Database schema check endpoint
app.get('/check-schema', async (req, res) => {
  try {
    const pool = require('./config/db');
    const client = await pool.connect();
    
    // Check if users table exists
    const usersTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    // Check if products table exists
    const productsTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `);
    
    let usersTableInfo = null;
    let productsTableInfo = null;
    
    if (usersTableExists.rows[0].exists) {
      // Get users table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      usersTableInfo = columns.rows;
    }
    
    if (productsTableExists.rows[0].exists) {
      // Get products table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'products'
        ORDER BY ordinal_position;
      `);
      productsTableInfo = columns.rows;
    }
    
    client.release();
    
    res.json({
      success: true,
      usersTableExists: usersTableExists.rows[0].exists,
      productsTableExists: productsTableExists.rows[0].exists,
      usersTableStructure: usersTableInfo,
      productsTableStructure: productsTableInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Schema check failed',
      error: error.message
    });
  }
});

// Manual table creation endpoint
app.get('/create-tables', async (req, res) => {
  try {
    const pool = require('./config/db');
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        in_stock BOOLEAN DEFAULT true,
        free_shipping BOOLEAN DEFAULT false,
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    client.release();
    
    res.json({
      success: true,
      message: 'Tables created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Table creation failed',
      error: error.message
    });
  }
});

// Add sample products endpoint
app.get('/add-sample-products', async (req, res) => {
  try {
    const pool = require('./config/db');
    const client = await pool.connect();
    
    // Sample products data
    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        category: 'Electronics',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        in_stock: true,
        free_shipping: true
      },
      {
        name: 'Smartphone Case',
        description: 'Durable protective case for smartphones',
        price: 19.99,
        category: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1603313011108-4f2d3c3c3c3c?w=400',
        in_stock: true,
        free_shipping: false
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable laptop stand for better ergonomics',
        price: 49.99,
        category: 'Office',
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        in_stock: true,
        free_shipping: true
      }
    ];
    
    // Insert sample products
    for (const product of sampleProducts) {
      await client.query(`
        INSERT INTO products (name, description, price, category, image_url, in_stock, free_shipping)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [product.name, product.description, product.price, product.category, product.image_url, product.in_stock, product.free_shipping]);
    }
    
    client.release();
    
    res.json({
      success: true,
      message: 'Sample products added successfully',
      count: sampleProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add sample products',
      error: error.message
    });
  }
});

// API Routes
app.use('/', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Astra API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  
  // Initialize database
  try {
    await initDatabase();
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
