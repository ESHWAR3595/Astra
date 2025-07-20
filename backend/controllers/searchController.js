const axios = require('axios');
const config = require('../config/environment');

const searchController = {
  // Search products in Elasticsearch
  searchProducts: async (req, res) => {
    const { q: query, page = 1, limit = 10, category, minPrice, maxPrice } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query is required' 
      });
    }

    // Check if Elasticsearch URL is configured
    if (!config.elasticsearch.url || config.elasticsearch.url === 'http://localhost:9200') {
      return res.status(503).json({ 
        success: false, 
        message: 'Elasticsearch is not configured. Please set ELASTICSEARCH_URL in Railway.',
        setupGuide: 'Check RAILWAY_ELASTICSEARCH_SETUP.md for setup instructions'
      });
    }

    // Prepare authentication headers for Railway Elasticsearch
    const authHeaders = {};
    if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
      const auth = Buffer.from(`${process.env.ELASTIC_USERNAME}:${process.env.ELASTIC_PASSWORD}`).toString('base64');
      authHeaders['Authorization'] = `Basic ${auth}`;
    }

    // Check if Elasticsearch Index Exists
    try {
      await axios.get(`${config.elasticsearch.url}/products`, {
        headers: { ...authHeaders },
        timeout: 10000
      });
    } catch (error) {
      console.error('Elasticsearch index does not exist:', error.response?.data || error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Elasticsearch index does not exist. Please run /setup-elasticsearch first.",
        elasticsearchUrl: config.elasticsearch.url,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Build Elasticsearch query with filters
    const esQuery = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query,
                fields: ['name^2', 'description', 'category'],
                type: "best_fields",
                fuzziness: "AUTO",
                operator: "or"
              }
            }
          ],
          filter: []
        }
      },
      from: (page - 1) * limit,
      size: limit,
      sort: [
        { "_score": { "order": "desc" } },
        { "name.keyword": { "order": "asc" } }
      ]
    };

    // Add category filter
    if (category) {
      esQuery.query.bool.filter.push({
        term: { "category.keyword": category.toLowerCase() }
      });
    }

    // Add price range filters
    if (minPrice || maxPrice) {
      const rangeFilter = { range: { price: {} } };
      if (minPrice) rangeFilter.range.price.gte = parseFloat(minPrice);
      if (maxPrice) rangeFilter.range.price.lte = parseFloat(maxPrice);
      esQuery.query.bool.filter.push(rangeFilter);
    }

    try {
      const response = await axios.post(
        `${config.elasticsearch.url}/products/_search`,
        esQuery,
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...authHeaders
          },
          timeout: 10000
        }
      );

      console.log('Elasticsearch Response:', {
        query: query,
        total: response.data.hits.total.value,
        took: response.data.took
      });

      if (response.data.hits.total.value > 0) {
        // Transform Elasticsearch results to match our API format
        const products = response.data.hits.hits.map(hit => ({
          id: hit._source.id,
          name: hit._source.name,
          description: hit._source.description,
          imageUrl: hit._source.imageUrl,
          price: hit._source.price,
          inStock: hit._source.inStock,
          freeShipping: hit._source.freeShipping,
          category: hit._source.category,
          score: hit._score
        }));

        res.json({
          success: true,
          query: query,
          data: products,
          total: response.data.hits.total.value,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(response.data.hits.total.value / limit)
          }
        });
      } else {
        res.json({ 
          success: true, 
          query: query,
          data: [],
          message: 'No results found',
          total: 0,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: 0
          }
        });
      }
    } catch (error) {
      console.error('Error querying Elasticsearch:', error.response?.data || error.message);
      res.status(500).json({ 
        success: false, 
        message: 'Search query failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        elasticsearchUrl: config.elasticsearch.url
      });
    }
  }
};

module.exports = searchController; 