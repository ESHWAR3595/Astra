#!/bin/bash

echo "🚀 Setting up Astra E-Commerce for PRODUCTION..."

# Check if Podman is available
if ! command -v podman &> /dev/null; then
    echo "❌ Error: Podman is required for production setup"
    exit 1
fi

echo "🐳 Using Podman..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
podman stop astra-frontend astra-backend astra-db 2>/dev/null || true
podman rm astra-frontend astra-backend astra-db 2>/dev/null || true

# Build images
echo "🔨 Building images..."
cd backend && podman build -t localhost/astra-backend:latest -f Dockerfile . && cd ..
cd front && podman build -t localhost/astra-frontend-simple:latest -f Dockerfile . && cd ..

# Start PostgreSQL
echo "🗄️ Starting PostgreSQL..."
podman run -d --name astra-db \
  -e POSTGRES_DB=astra \
  -e POSTGRES_USER=astra_user \
  -e POSTGRES_PASSWORD=astra_password \
  -p 5435:5432 \
  postgres:15-alpine

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Start Backend
echo "🔧 Starting Backend..."
podman run -d --name astra-backend \
  -p 5001:5000 \
  -e NODE_ENV=production \
  -e CONTAINERIZED=true \
  -e PORT=5000 \
  -e DB_USER=astra_user \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=astra \
  -e DB_PASS=astra_password \
  -e DB_PORT=5435 \
  -e JWT_SECRET=your_super_secret_jwt_key_here \
  -e ELASTICSEARCH_URL=http://localhost:9200 \
  -e FRONTEND_URL=http://localhost:8080 \
  localhost/astra-backend:latest

# Setup database
echo "🗄️ Setting up database..."
sleep 5
podman exec astra-backend node setupDatabase.js

# Setup Elasticsearch
echo "🔍 Setting up Elasticsearch..."
podman exec astra-backend node setupElasticsearch.js

# Start Frontend
echo "🎨 Starting Frontend..."
podman run -d --name astra-frontend \
  -p 8080:80 \
  localhost/astra-frontend-simple:latest

echo "✅ Setup completed!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:5001"
echo "   Elasticsearch: http://localhost:9200"
echo ""
echo "📝 To view logs:"
echo "   podman logs -f astra-backend"
echo "   podman logs -f astra-frontend"
echo ""
echo "🛑 To stop:"
echo "   podman stop astra-frontend astra-backend astra-db" 