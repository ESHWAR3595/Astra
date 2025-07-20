// Environment configuration for Astra E-Commerce
// Works both locally and with Podman/Docker containers

const isContainerized = process.env.NODE_ENV === 'production' || process.env.CONTAINERIZED === 'true';

const config = {
  // Database configuration
  database: {
    host: process.env.DB_HOST || (isContainerized ? 'host.docker.internal' : 'localhost'),
    port: process.env.DB_PORT || 5435,
    name: process.env.DB_NAME || 'astra',
    user: process.env.DB_USER || 'astra_user',
    password: process.env.DB_PASS || 'astra_password',
  },

  // Elasticsearch configuration
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || (isContainerized ? 'http://host.docker.internal:9200' : 'http://localhost:9200'),
  },

  // Frontend configuration
  frontend: {
    url: process.env.FRONTEND_URL || (isContainerized ? 'http://host.docker.internal:8080' : 'http://localhost:3000'),
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
  },

  // CORS configuration
  cors: {
    origin: [
      process.env.FRONTEND_URL || (isContainerized ? 'http://host.docker.internal:8080' : 'http://localhost:3000'),
      'https://astraecom.netlify.app',
      'https://astra-ecommerce.netlify.app',
      'http://localhost:3000',
      'http://localhost:8080'
    ],
    credentials: true,
  }
};

module.exports = config; 