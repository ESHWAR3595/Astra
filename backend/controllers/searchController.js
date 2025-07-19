const axios = require('axios');

const searchController = {
  // Search products in Elasticsearch
  searchProducts: async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query is required' 
      });
    }

    // Check if Elasticsearch Index Exists
    try {
      await axios.get(`${process.env.ELASTICSEARCH_URL || 'http://localhost:9200'}/products`);
    } catch (error) {
      console.error('Elasticsearch index does not exist:', error.response?.data || error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Elasticsearch index does not exist" 
      });
    }

    // Elasticsearch Query with Better Matching
    const esQuery = {
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: query,
                fields: ['name', 'description', 'category'],
                type: "best_fields",
                fuzziness: "AUTO",
                operator: "or"
              }
            },
            {
              match_phrase: {
                name: query
              }
            }
          ],
          minimum_should_match: 1
        }
      }
    };

    try {
      const response = await axios.post(
        `${process.env.ELASTICSEARCH_URL || 'http://localhost:9200'}/products/_search`,
        esQuery,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Elasticsearch Response:', response.data);

      if (response.data.hits.total.value > 0) {
        res.json({
          success: true,
          data: response.data.hits.hits,
          total: response.data.hits.total.value
        });
      } else {
        res.json({ 
          success: true, 
          data: [],
          message: 'No results found',
          total: 0
        });
      }
    } catch (error) {
      console.error('Error querying Elasticsearch:', error.response?.data || error.message);
      res.status(500).json({ 
        success: false, 
        message: 'Search query failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = searchController; 