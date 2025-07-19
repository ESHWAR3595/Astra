# 🚀 Astra E-Commerce Setup Guide

This guide shows you how to run Astra E-Commerce in both **local development** and **production** environments.

## 🎯 Quick Start

### Option 1: Local Development (Recommended for Development)
```bash
./setup-local.sh
```

### Option 2: Production/Containerized (Recommended for Production)
```bash
./setup-production.sh
```

## 📋 Prerequisites

- **Docker** or **Podman** installed
- **Node.js 18+** (for local development)
- **Git** (to clone the repository)

## 🏠 Local Development Setup

### What it includes:
- ✅ Hot reloading for both frontend and backend
- ✅ Development-friendly ports (3000, 5001, 5435, 9200)
- ✅ Volume mounting for live code changes
- ✅ All services in containers for consistency

### How to run:
```bash
# Method 1: Using the setup script (recommended)
./setup-local.sh

# Method 2: Manual setup
docker-compose -f docker-compose.local.yml up --build
```

### Access URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601

## 🐳 Production/Containerized Setup

### What it includes:
- ✅ Optimized production builds
- ✅ Nginx serving static frontend
- ✅ Production-ready configurations
- ✅ Elasticsearch search functionality

### How to run:
```bash
# Method 1: Using the setup script (recommended)
./setup-production.sh

# Method 2: Manual setup
# Build and run containers individually
```

### Access URLs:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **Elasticsearch**: http://localhost:9200

## 🔧 Manual Setup (Step by Step)

### 1. Database Setup
```bash
# Start PostgreSQL
podman run -d --name astra-db \
  -e POSTGRES_DB=astra \
  -e POSTGRES_USER=astra_user \
  -e POSTGRES_PASSWORD=astra_password \
  -p 5435:5432 \
  postgres:15-alpine
```

### 2. Backend Setup
```bash
# Build backend image
cd backend
podman build -t localhost/astra-backend:latest .

# Start backend container
podman run -d --name astra-backend \
  -p 5001:5000 \
  -e NODE_ENV=production \
  -e CONTAINERIZED=true \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5435 \
  -e ELASTICSEARCH_URL=http://localhost:9200 \
  localhost/astra-backend:latest

# Setup database and Elasticsearch
podman exec astra-backend node setupDatabase.js
podman exec astra-backend node setupElasticsearch.js
```

### 3. Frontend Setup
```bash
# Build frontend image
cd front
podman build -t localhost/astra-frontend-simple:latest .

# Start frontend container
podman run -d --name astra-frontend \
  -p 8080:80 \
  localhost/astra-frontend-simple:latest
```

## 🌐 Environment Configuration

The application automatically detects whether it's running locally or in containers and adjusts configurations accordingly:

### Local Development:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`
- Database: `localhost:5435`
- Elasticsearch: `http://localhost:9200`

### Production/Containerized:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5001`
- Database: `host.docker.internal:5435`
- Elasticsearch: `http://host.docker.internal:9200`

## 🔍 Features

### ✅ Working Features:
- **User Authentication**: Register, Login, Logout
- **Product Catalog**: 19 sample products
- **Search Functionality**: Elasticsearch-powered search
- **Session Management**: Secure user sessions
- **Database**: PostgreSQL with proper schema
- **API**: RESTful API with CORS support

### 🎯 Search Capabilities:
- **Case-insensitive search**
- **Partial matching**
- **Category-based search**
- **Description search**
- **Fuzzy matching**

## 🛠️ Troubleshooting

### Common Issues:

1. **Port conflicts**:
   ```bash
   # Check what's using the ports
   lsof -i :3000 -i :5001 -i :5435 -i :8080 -i :9200
   ```

2. **Container networking issues**:
   ```bash
   # Restart containers
   podman restart astra-backend astra-frontend astra-db
   ```

3. **Database connection issues**:
   ```bash
   # Check database status
   podman logs astra-db
   ```

4. **Elasticsearch issues**:
   ```bash
   # Check Elasticsearch status
   curl http://localhost:9200/_cluster/health
   ```

### Useful Commands:

```bash
# View all containers
podman ps

# View logs
podman logs -f astra-backend
podman logs -f astra-frontend

# Stop all containers
podman stop astra-frontend astra-backend astra-db

# Remove all containers
podman rm astra-frontend astra-backend astra-db

# Clean up images
podman image prune -f
```

## 📁 Project Structure

```
Astra/
├── backend/                 # Node.js API
│   ├── config/             # Configuration files
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── setupDatabase.js   # Database setup
│   ├── setupElasticsearch.js # Elasticsearch setup
│   └── Dockerfile         # Production Dockerfile
├── front/                  # React frontend
│   ├── src/               # Source code
│   ├── public/            # Static files
│   └── Dockerfile         # Production Dockerfile
├── docker-compose.local.yml # Local development
├── setup-local.sh         # Local setup script
├── setup-production.sh    # Production setup script
└── README.md              # Main documentation
```

## 🎉 Success!

Once everything is running, you should see:
- ✅ Frontend accessible at the specified URL
- ✅ Backend API responding to requests
- ✅ Database with 19 sample products
- ✅ Search functionality working
- ✅ User authentication working

**Happy coding! 🚀✨** 