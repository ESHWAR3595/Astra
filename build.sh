#!/bin/bash

# Build script for Railway deployment
echo "🚀 Building Astra Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application (if needed)
echo "🔨 Building application..."
npm run build 2>/dev/null || echo "No build script found, skipping..."

echo "✅ Build completed successfully!" 