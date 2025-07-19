#!/bin/bash

echo "🚀 Astra E-Commerce Universal Setup"
echo "=================================="

# Check if Docker/Podman is available
if ! command -v docker &> /dev/null && ! command -v podman &> /dev/null; then
    echo "❌ Error: Neither Docker nor Podman is installed or running"
    exit 1
fi

# Use Podman if available, otherwise Docker
if command -v podman &> /dev/null; then
    echo "🐳 Using Podman..."
    COMPOSE_CMD="podman-compose"
    CONTAINER_CMD="podman"
else
    echo "🐳 Using Docker..."
    COMPOSE_CMD="docker-compose"
    CONTAINER_CMD="docker"
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to stop local services
stop_local_services() {
    echo "🛑 Stopping local services on ports 5001, 8080, 5435, 9200..."
    
    # Stop processes on our ports
    for port in 5001 8080 5435 9200; do
        if check_port $port; then
            echo "   Stopping process on port $port..."
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
    
    # Stop any existing containers
    $CONTAINER_CMD stop astra-frontend astra-backend astra-db es 2>/dev/null || true
    $CONTAINER_CMD rm astra-frontend astra-backend astra-db es 2>/dev/null || true
}

# Function to setup containers
setup_containers() {
    echo "🔨 Setting up containers..."
    
    # Build images
    echo "   Building backend image..."
    cd backend && $CONTAINER_CMD build -t localhost/astra-backend:latest -f Dockerfile . && cd ..
    
    echo "   Building frontend image..."
    cd front && $CONTAINER_CMD build -t localhost/astra-frontend-simple:latest -f Dockerfile . && cd ..
    
    # Start PostgreSQL
    echo "   Starting PostgreSQL..."
    $CONTAINER_CMD run -d --name astra-db \
      -e POSTGRES_DB=astra \
      -e POSTGRES_USER=astra_user \
      -e POSTGRES_PASSWORD=astra_password \
      -p 5435:5432 \
      postgres:15-alpine
    
    # Wait for PostgreSQL
    echo "   Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Start Backend
    echo "   Starting Backend..."
    $CONTAINER_CMD run -d --name astra-backend \
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
      -e SESSION_SECRET=your_super_secret_session_key_here \
      localhost/astra-backend:latest
    
    # Setup database and Elasticsearch
    echo "   Setting up database..."
    sleep 5
    $CONTAINER_CMD exec astra-backend node setupDatabase.js
    
    echo "   Setting up Elasticsearch..."
    $CONTAINER_CMD exec astra-backend node setupElasticsearch.js
    
    # Start Frontend
    echo "   Starting Frontend..."
    $CONTAINER_CMD run -d --name astra-frontend \
      -p 8080:80 \
      -e REACT_APP_CONTAINERIZED=true \
      localhost/astra-frontend-simple:latest
}

# Function to setup local development
setup_local() {
    echo "🏠 Setting up local development environment..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Install backend dependencies
    echo "   Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    # Install frontend dependencies
    echo "   Installing frontend dependencies..."
    cd front && npm install && cd ..
    
    # Start PostgreSQL container
    echo "   Starting PostgreSQL container..."
    $CONTAINER_CMD run -d --name astra-db \
      -e POSTGRES_DB=astra \
      -e POSTGRES_USER=astra_user \
      -e POSTGRES_PASSWORD=astra_password \
      -p 5435:5432 \
      postgres:15-alpine
    
    # Wait for PostgreSQL
    echo "   Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Setup database
    echo "   Setting up database..."
    cd backend && node setupDatabase.js && cd ..
    
    # Setup Elasticsearch
    echo "   Setting up Elasticsearch..."
    cd backend && node setupElasticsearch.js && cd ..
    
    echo "✅ Local setup completed!"
    echo ""
    echo "🌐 To start the application:"
    echo "   Terminal 1: cd backend && npm start"
    echo "   Terminal 2: cd front && npm start"
    echo ""
    echo "📱 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend: http://localhost:5001"
}

# Main setup logic
echo "Choose your setup type:"
echo "1) Containerized (Production-like)"
echo "2) Local Development"
echo "3) Both (Stop local, start containers)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🐳 Setting up containerized environment..."
        stop_local_services
        setup_containers
        echo "✅ Containerized setup completed!"
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend: http://localhost:8080"
        echo "   Backend: http://localhost:5001"
        echo "   Elasticsearch: http://localhost:9200"
        ;;
    2)
        echo "🏠 Setting up local development environment..."
        stop_local_services
        setup_local
        ;;
    3)
        echo "🔄 Setting up both environments..."
        stop_local_services
        setup_containers
        echo "✅ Both environments ready!"
        echo ""
        echo "🌐 Containerized:"
        echo "   Frontend: http://localhost:8080"
        echo "   Backend: http://localhost:5001"
        echo ""
        echo "🏠 Local Development:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend: http://localhost:5001"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📝 Useful commands:"
echo "   View logs: $CONTAINER_CMD logs -f astra-backend"
echo "   Stop all: $CONTAINER_CMD stop astra-frontend astra-backend astra-db es"
echo "   Remove all: $CONTAINER_CMD rm astra-frontend astra-backend astra-db es" 