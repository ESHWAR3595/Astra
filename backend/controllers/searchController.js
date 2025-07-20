const axios = require('axios');
const config = require('../config/environment');
const { Pool } = require('pg');

// PostgreSQL search function
const performPostgreSQLSearch = async (req, res) => {
  const { q: query, page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Build PostgreSQL search query
    let sqlQuery = `
      SELECT id, name, description, price, category, 
             "imageUrl", rating, "stockQuantity", "inStock", "freeShipping"
      FROM products 
      WHERE (
        name ILIKE $1 OR 
        description ILIKE $1 OR 
        category ILIKE $1
      )
    `;
    
    const searchTerm = `%${query}%`;
    const queryParams = [searchTerm];
    let paramCount = 1;

    // Add category filter
    if (category) {
      paramCount++;
      sqlQuery += ` AND category ILIKE $${paramCount}`;
      queryParams.push(`%${category}%`);
    }

    // Add price range filters
    if (minPrice || maxPrice) {
      if (minPrice) {
        paramCount++;
        sqlQuery += ` AND price >= $${paramCount}`;
        queryParams.push(parseFloat(minPrice));
      }
      if (maxPrice) {
        paramCount++;
        sqlQuery += ` AND price <= $${paramCount}`;
        queryParams.push(parseFloat(maxPrice));
      }
    }

    // Add pagination
    sqlQuery += ` ORDER BY name ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await pool.query(sqlQuery, queryParams);
    await pool.end();

    console.log('PostgreSQL search results:', result.rows.length);

    res.json({
      success: true,
      query: query,
      data: result.rows,
      total: result.rows.length,
      source: 'postgresql',
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.rows.length / limit)
      }
    });
  } catch (pgError) {
    console.error('PostgreSQL search failed:', pgError);
    res.status(500).json({ 
      success: false, 
      message: 'Search query failed - database unavailable',
      error: process.env.NODE_ENV === 'development' ? pgError.message : undefined
    });
  }
};

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
      console.log('Elasticsearch not configured, falling back to PostgreSQL search...');
      return await performPostgreSQLSearch(req, res);
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
      console.log('Falling back to PostgreSQL search...');
      return await performPostgreSQLSearch(req, res);
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
          source: 'elasticsearch',
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
          source: 'elasticsearch',
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: 0
          }
        });
      }
    } catch (error) {
      console.error('Error querying Elasticsearch:', error.response?.data || error.message);
      
      // Fallback to PostgreSQL search
      console.log('Falling back to PostgreSQL search...');
      return await performPostgreSQLSearch(req, res);
    }
  }
};

module.exports = searchController; 