#!/bin/bash

echo "🏠 Starting Astra E-Commerce Local Development"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL container is running
if ! podman ps | grep -q astra-db; then
    echo "🗄️ Starting PostgreSQL container..."
    podman run -d --name astra-db \
      -e POSTGRES_DB=astra \
      -e POSTGRES_USER=astra_user \
      -e POSTGRES_PASSWORD=astra_password \
      -p 5435:5432 \
      postgres:15-alpine
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
    
    echo "🗄️ Setting up database..."
    cd backend && node setupDatabase.js && cd ..
    
    echo "🔍 Setting up Elasticsearch..."
    cd backend && node setupElasticsearch.js && cd ..
else
    echo "✅ PostgreSQL container is already running"
fi

# Check if backend is running
if ! lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🔧 Starting Backend..."
    cd backend && npm start &
    cd ..
    echo "⏳ Waiting for backend to start..."
    sleep 5
else
    echo "✅ Backend is already running on port 5001"
fi

# Check if frontend is running
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🎨 Starting Frontend..."
    cd front && npm start &
    cd ..
else
    echo "✅ Frontend is already running on port 3000"
fi

echo ""
echo "✅ Local development environment started!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5001"
echo "   Elasticsearch: http://localhost:9200"
echo ""
echo "📝 To stop:"
echo "   Press Ctrl+C in each terminal"
echo "   Or run: pkill -f 'npm start'" 