# Railway Elasticsearch Setup Guide

## Option 1: Railway Elasticsearch Service (Recommended)

Railway offers Elasticsearch as a managed service. Here's how to set it up:

### Step 1: Add Elasticsearch Service
1. Go to your Railway project dashboard
2. Click "New Service" → "Database" → "Elasticsearch"
3. Choose version 8.11.0
4. Railway will automatically provision the service

### Step 2: Configure Environment Variables
Railway will automatically set these environment variables:
- `ELASTICSEARCH_URL` - The connection URL
- `ELASTICSEARCH_USERNAME` - Username (if security enabled)
- `ELASTICSEARCH_PASSWORD` - Password (if security enabled)

### Step 3: Update Backend Configuration
The backend will automatically use the Railway Elasticsearch URL.

## Option 2: External Elasticsearch Service

### Option 2A: Elastic Cloud (Free Tier)
1. Sign up at https://cloud.elastic.co/
2. Create a free deployment
3. Get the connection URL
4. Add to Railway environment variables:
   ```
   ELASTICSEARCH_URL=https://your-deployment.elastic-cloud.com
   ```

### Option 2B: Bonsai (Free Tier)
1. Sign up at https://bonsai.io/
2. Create a free cluster
3. Get the connection URL
4. Add to Railway environment variables:
   ```
   ELASTICSEARCH_URL=https://your-cluster.bonsai.io
   ```

## Option 3: Self-Hosted Elasticsearch

### Using Railway's Custom Service
1. Create a new service in Railway
2. Use Docker image: `docker.elastic.co/elasticsearch/elasticsearch:8.11.0`
3. Set environment variables:
   ```
   discovery.type=single-node
   xpack.security.enabled=false
   ES_JAVA_OPTS=-Xms512m -Xmx512m
   ```

## Testing the Setup

After setting up Elasticsearch, test it:

1. **Setup Elasticsearch Index:**
   ```
   https://your-railway-app.railway.app/setup-elasticsearch
   ```

2. **Test Search:**
   ```
   https://your-railway-app.railway.app/api/search?q=headphones
   ```

## Environment Variables for Railway

Add these to your Railway backend service:

```env
ELASTICSEARCH_URL=https://your-elasticsearch-url
NODE_ENV=production
```

## Troubleshooting

### Common Issues:
1. **Connection Timeout**: Check if Elasticsearch URL is correct
2. **Authentication Error**: Ensure security settings match
3. **Memory Issues**: Reduce ES_JAVA_OPTS memory allocation

### Debug Commands:
```bash
# Test Elasticsearch connection
curl -X GET "https://your-elasticsearch-url/_cluster/health"

# Check index exists
curl -X GET "https://your-elasticsearch-url/products"
``` 