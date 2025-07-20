// Database initialization script
const pool = require('./db');

const initDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Debug: Log ALL environment variables related to database
    console.log('🔍 Environment Variables:');
    console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
    console.log('  PGHOST:', process.env.PGHOST || 'NOT SET');
    console.log('  PGDATABASE:', process.env.PGDATABASE || 'NOT SET');
    console.log('  PGUSER:', process.env.PGUSER || 'NOT SET');
    console.log('  PGPASSWORD:', process.env.PGPASSWORD ? 'SET' : 'NOT SET');
    console.log('  PGPORT:', process.env.PGPORT || 'NOT SET');
    console.log('  DB_HOST:', process.env.DB_HOST || 'NOT SET');
    console.log('  DB_NAME:', process.env.DB_NAME || 'NOT SET');
    console.log('  DB_USER:', process.env.DB_USER || 'NOT SET');
    console.log('  DB_PASS:', process.env.DB_PASS ? 'SET' : 'NOT SET');
    console.log('  DB_PORT:', process.env.DB_PORT || 'NOT SET');
    
    // Debug: Log database configuration (without password)
    const config = require('./environment');
    console.log('📊 Database config:', {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      hasPassword: !!config.database.password
    });
    
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Create users table
    await pool.query(`
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sessions table (if using database sessions)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      )
    `);
    
    console.log('✅ Database initialized successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('🔍 Error details:', {
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
    });
    throw error;
  }
};

module.exports = initDatabase; 