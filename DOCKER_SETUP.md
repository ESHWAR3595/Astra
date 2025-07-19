# 🐳 Docker Setup Guide - Astra E-Commerce

This guide will help you build and run the Astra e-commerce application using Docker.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- At least 4GB of available RAM
- At least 10GB of available disk space

## 🚀 Quick Start

### 1. Production Build & Run

```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Development Build & Run

```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up --build -d

# Check service status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🏗️ Individual Service Commands

### Backend Only

```bash
# Build backend image
docker build -t astra-backend ./backend

# Run backend container
docker run -d \
  --name astra-backend \
  -p 5000:5000 \
  -e DB_USER=astra_user \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=astra \
  -e DB_PASS=astra_password \
  -e DB_PORT=5432 \
  -e JWT_SECRET=your_jwt_secret \
  -e ELASTICSEARCH_URL=http://host.docker.internal:9200 \
  astra-backend
```

### Frontend Only

```bash
# Build frontend image
docker build -t astra-frontend ./front

# Run frontend container
docker run -d \
  --name astra-frontend \
  -p 80:80 \
  astra-frontend
```

### Database Only

```bash
# Run PostgreSQL
docker run -d \
  --name astra-postgres \
  -e POSTGRES_DB=astra \
  -e POSTGRES_USER=astra_user \
  -e POSTGRES_PASSWORD=astra_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Run Elasticsearch
docker run -d \
  --name astra-elasticsearch \
  -e discovery.type=single-node \
  -e xpack.security.enabled=false \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -p 9200:9200 \
  -p 9300:9300 \
  -v elasticsearch_data:/usr/share/elasticsearch/data \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

## 🔧 Development Commands

### Hot Reload Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f backend-dev
docker-compose -f docker-compose.dev.yml logs -f frontend-dev

# Execute commands in running containers
docker-compose -f docker-compose.dev.yml exec backend-dev npm install
docker-compose -f docker-compose.dev.yml exec frontend-dev npm install
```

### Database Management

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U astra_user -d astra

# Backup database
docker-compose exec postgres pg_dump -U astra_user astra > backup.sql

# Restore database
docker-compose exec -T postgres psql -U astra_user -d astra < backup.sql

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

## 📊 Monitoring & Debugging

### Health Checks

```bash
# Check all service health
docker-compose ps

# Check specific service health
docker inspect astra-backend | grep Health -A 10
docker inspect astra-frontend | grep Health -A 10
```

### Logs & Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
docker-compose logs elasticsearch

# Follow logs in real-time
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend
```

### Container Management

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose up --build backend

# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans
```

## 🌐 Access Points

### Production Environment
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Elasticsearch**: http://localhost:9200

### Development Environment
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Elasticsearch**: http://localhost:9200

## 🔒 Environment Variables

### Backend Environment
```env
NODE_ENV=production
PORT=5000
DB_USER=astra_user
DB_HOST=postgres
DB_NAME=astra
DB_PASS=astra_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
ELASTICSEARCH_URL=http://elasticsearch:9200
```

### Frontend Environment
```env
REACT_APP_API_URL=http://localhost:5000
CHOKIDAR_USEPOLLING=true
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :5000
lsof -i :3000
lsof -i :80

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

#### 3. Elasticsearch Issues
```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# Check Elasticsearch logs
docker-compose logs elasticsearch

# Restart Elasticsearch
docker-compose restart elasticsearch
```

#### 4. Build Issues
```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check disk space
df -h
```

### Performance Optimization

#### 1. Increase Docker Resources
- Open Docker Desktop
- Go to Settings > Resources
- Increase Memory to 4GB+
- Increase CPUs to 2+

#### 2. Optimize Elasticsearch
```yaml
# In docker-compose.yml
environment:
  - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
```

#### 3. Database Optimization
```yaml
# In docker-compose.yml
command: postgres -c shared_buffers=256MB -c max_connections=100
```

## 🚀 Production Deployment

### 1. Build Production Images
```bash
# Build all production images
docker-compose build

# Push to registry (if using)
docker tag astra-backend your-registry/astra-backend:latest
docker push your-registry/astra-backend:latest
```

### 2. Production Environment Variables
```bash
# Create production .env file
cp .env.example .env.prod

# Edit with production values
nano .env.prod
```

### 3. Deploy with Production Profile
```bash
# Deploy with production nginx
docker-compose --profile production up -d
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up --scale backend=3

# Scale with load balancer
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

### Load Balancer Configuration
```yaml
# docker-compose.scale.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker images
        run: |
          docker-compose build
      - name: Push to registry
        run: |
          docker push your-registry/astra-backend:latest
          docker push your-registry/astra-frontend:latest
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Elasticsearch Docker Image](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**Happy Dockerizing! 🐳✨** 