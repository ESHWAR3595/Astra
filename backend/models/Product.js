const pool = require('../config/db'); // Your PostgreSQL pool

const Product = {
  /**
   * Fetch all products from the database.
   * @returns {Promise<Array>} List of products.
   */
  getAllProducts: async () => {
    try {
      const result = await pool.query('SELECT * FROM products');
      return result.rows; // Return all products
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  },

  /**
   * Insert a new product into the database.
   * @param {Object} product - Product details.
   * @param {string} product.name - Name of the product.
   * @param {string} product.description - Description of the product.
   * @param {string} product.imageUrl - URL of the product image.
   * @returns {Promise<Object>} The newly created product.
   */
  createProduct: async ({ name, description, imageUrl }) => {
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, imageUrl) VALUES ($1, $2, $3) RETURNING *',
        [name, description, imageUrl]
      );
      return result.rows[0]; // Return the newly created product
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  },

  /**
   * Fetch a single product by its ID.
   * @param {number} id - ID of the product.
   * @returns {Promise<Object>} The product with the specified ID.
   */
  getProductById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      return result.rows[0]; // Return the single product
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      throw err;
    }
  },

  // Additional functions to update or delete products can go here
};

module.exports = Product;
