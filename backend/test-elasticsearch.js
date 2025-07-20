const axios = require('axios');

const testElasticsearch = async () => {
  const elasticsearchUrl = process.env.ELASTICSEARCH_URL || 'https://elasticsearch-c1d4ca56-production.up.railway.app';
  
  console.log('Testing Elasticsearch connection...');
  console.log('URL:', elasticsearchUrl);
  
  try {
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const healthResponse = await axios.get(`${elasticsearchUrl}/_cluster/health`, {
      timeout: 10000
    });
    console.log('✅ Health check successful:', healthResponse.data);
    
    // Test if products index exists
    console.log('\n2. Testing products index...');
    try {
      const indexResponse = await axios.get(`${elasticsearchUrl}/products`, {
        timeout: 10000
      });
      console.log('✅ Products index exists:', indexResponse.data);
    } catch (indexError) {
      console.log('❌ Products index does not exist (this is expected if not set up yet)');
      console.log('Error:', indexError.response?.data || indexError.message);
    }
    
    // Test creating index
    console.log('\n3. Testing index creation...');
    const createResponse = await axios.put(`${elasticsearchUrl}/products`, {
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: { type: 'text' },
          description: { type: 'text' },
          price: { type: 'float' },
          category: { type: 'keyword' },
          imageUrl: { type: 'keyword' },
          rating: { type: 'float' },
          stockQuantity: { type: 'integer' },
          inStock: { type: 'boolean' },
          freeShipping: { type: 'boolean' }
        }
      }
    }, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Index created successfully:', createResponse.data);
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
    console.log('Headers:', error.response?.headers);
  }
};

testElasticsearch(); 