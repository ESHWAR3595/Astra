#!/bin/bash

echo "🚀 Setting up Astra E-Commerce for LOCAL development..."

# Check if Docker/Podman is running
if ! command -v docker &> /dev/null && ! command -v podman &> /dev/null; then
    echo "❌ Error: Neither Docker nor Podman is installed or running"
    exit 1
fi

# Use Podman if available, otherwise Docker
if command -v podman &> /dev/null; then
    echo "🐳 Using Podman..."
    COMPOSE_CMD="podman-compose"
else
    echo "🐳 Using Docker..."
    COMPOSE_CMD="docker-compose"
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
$COMPOSE_CMD -f docker-compose.local.yml down

# Build and start services
echo "🔨 Building and starting services..."
$COMPOSE_CMD -f docker-compose.local.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Setup database
echo "🗄️ Setting up database..."
$COMPOSE_CMD -f docker-compose.local.yml exec astra-backend-local node setupDatabase.js

# Setup Elasticsearch
echo "🔍 Setting up Elasticsearch..."
$COMPOSE_CMD -f docker-compose.local.yml exec astra-backend-local node setupElasticsearch.js

echo "✅ Setup completed!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5001"
echo "   Elasticsearch: http://localhost:9200"
echo "   Kibana: http://localhost:5601"
echo ""
echo "📝 To view logs:"
echo "   $COMPOSE_CMD -f docker-compose.local.yml logs -f"
echo ""
echo "🛑 To stop:"
echo "   $COMPOSE_CMD -f docker-compose.local.yml down" 