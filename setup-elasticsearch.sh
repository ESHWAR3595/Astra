#!/bin/bash

# Astra E-Commerce Elasticsearch Setup Script
# This script helps set up Elasticsearch for the Astra project

echo "🚀 Astra E-Commerce Elasticsearch Setup"
echo "========================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Function to check if Elasticsearch is running
check_elasticsearch() {
    if curl -s http://localhost:9200 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if Elasticsearch is already running
if check_elasticsearch; then
    echo "✅ Elasticsearch is already running on http://localhost:9200"
    echo "   You can access Kibana at http://localhost:5601"
else
    echo "🔄 Starting Elasticsearch with Docker Compose..."
    
    # Start Elasticsearch and Kibana
    docker-compose -f elasticsearch-docker-compose.yml up -d
    
    echo "⏳ Waiting for Elasticsearch to start..."
    
    # Wait for Elasticsearch to be ready
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_elasticsearch; then
            echo "✅ Elasticsearch is now running!"
            break
        fi
        
        echo "   Attempt $attempt/$max_attempts - Waiting..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo "❌ Elasticsearch failed to start within the expected time"
        echo "   Check the logs with: docker-compose -f elasticsearch-docker-compose.yml logs"
        exit 1
    fi
fi

# Test Elasticsearch connection
echo "🔍 Testing Elasticsearch connection..."
if curl -s http://localhost:9200 > /dev/null; then
    echo "✅ Elasticsearch is responding correctly"
    
    # Get cluster info
    echo "📊 Cluster Information:"
    curl -s http://localhost:9200/_cluster/health | jq '.' 2>/dev/null || curl -s http://localhost:9200/_cluster/health
else
    echo "❌ Elasticsearch is not responding"
    exit 1
fi

echo ""
echo "🎉 Elasticsearch Setup Complete!"
echo "================================"
echo "📊 Elasticsearch: http://localhost:9200"
echo "🔍 Kibana: http://localhost:5601"
echo ""
echo "📝 Next Steps:"
echo "1. Wait for Railway to redeploy your backend"
echo "2. Visit your Railway backend URL + '/insert-all-products' to add products to PostgreSQL"
echo "3. Visit your Railway backend URL + '/setup-elasticsearch' to index products in Elasticsearch"
echo ""
echo "🔧 Useful Commands:"
echo "   Stop Elasticsearch: docker-compose -f elasticsearch-docker-compose.yml down"
echo "   View logs: docker-compose -f elasticsearch-docker-compose.yml logs -f"
echo "   Restart: docker-compose -f elasticsearch-docker-compose.yml restart" 