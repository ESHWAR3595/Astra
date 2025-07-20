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
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    let tableInfo = null;
    if (tableExists.rows[0].exists) {
      // Get table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      tableInfo = columns.rows;
    }
    
    client.release();
    
    res.json({
      success: true,
      usersTableExists: tableExists.rows[0].exists,
      tableStructure: tableInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Schema check failed',
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
