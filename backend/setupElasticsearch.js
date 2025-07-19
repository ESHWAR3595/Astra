const axios = require('axios');
const pool = require('./config/db');
const config = require('./config/environment');

const ELASTICSEARCH_URL = config.elasticsearch.url;

const setupElasticsearch = async () => {
  try {
    console.log('Setting up Elasticsearch...');

    // 1. Create the products index with mapping
    const indexMapping = {
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: { 
            type: 'text',
            analyzer: 'standard',
            fields: {
              keyword: { type: 'keyword' }
            }
          },
          description: { 
            type: 'text',
            analyzer: 'standard'
          },
          imageUrl: { type: 'keyword' },
          price: { type: 'float' },
          inStock: { type: 'boolean' },
          freeShipping: { type: 'boolean' },
          category: { 
            type: 'text',
            analyzer: 'standard',
            fields: {
              keyword: { type: 'keyword' }
            }
          }
        }
      },
      settings: {
        analysis: {
          analyzer: {
            standard: {
              type: 'standard',
              stopwords: '_english_'
            }
          }
        }
      }
    };

    // Delete index if it exists
    try {
      await axios.delete(`${ELASTICSEARCH_URL}/products`);
      console.log('Deleted existing products index');
    } catch (error) {
      // Index doesn't exist, which is fine
    }

    // Create new index
    await axios.put(`${ELASTICSEARCH_URL}/products`, indexMapping);
    console.log('Created products index with mapping');

    // 2. Get all products from PostgreSQL
    const result = await pool.query(`
      SELECT id, name, description, image_url as "imageUrl", price, 
             in_stock as "inStock", free_shipping as "freeShipping", category
      FROM products
    `);

    const products = result.rows;
    console.log(`Found ${products.length} products in database`);

    // 3. Index products in Elasticsearch
    const bulkOperations = [];
    
    for (const product of products) {
      // Add index operation
      bulkOperations.push({
        index: {
          _index: 'products',
          _id: product.id.toString()
        }
      });
      
      // Add document
      bulkOperations.push({
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: parseFloat(product.price),
        inStock: product.inStock,
        freeShipping: product.freeShipping,
        category: product.category
      });
    }

    if (bulkOperations.length > 0) {
      const bulkBody = bulkOperations.map(op => JSON.stringify(op)).join('\n') + '\n';
      
      const response = await axios.post(
        `${ELASTICSEARCH_URL}/_bulk`,
        bulkBody,
        {
          headers: { 'Content-Type': 'application/x-ndjson' }
        }
      );

      if (response.data.errors) {
        console.error('Some errors occurred during bulk indexing:', response.data.items);
      } else {
        console.log(`Successfully indexed ${products.length} products`);
      }
    }

    // 4. Refresh the index
    await axios.post(`${ELASTICSEARCH_URL}/products/_refresh`);
    console.log('Index refreshed');

    // 5. Verify the setup
    const countResponse = await axios.get(`${ELASTICSEARCH_URL}/products/_count`);
    console.log(`Elasticsearch index contains ${countResponse.data.count} documents`);

    console.log('Elasticsearch setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up Elasticsearch:', error.response?.data || error.message);
    throw error;
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  setupElasticsearch()
    .then(() => {
      console.log('Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupElasticsearch; 