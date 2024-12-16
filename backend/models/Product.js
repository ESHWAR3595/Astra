const pool = require('../config/db'); // PostgreSQL pool connection

const Product = {
  // Fetch all products from the database
  getAllProducts: async () => {
    try {
      const result = await pool.query(`
        SELECT id, name, description, image_url, CAST(price AS FLOAT) AS price, in_stock, free_shipping
        FROM products;

      `);
      return result.rows; // Ensure 'imageUrl' is correctly populated
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  },
  

  // Create a new product in the database
  createProduct: async ({ name, description, imageUrl, price, inStock, freeShipping }) => {
    try {
      const cleanedUrl = imageUrl.trim(); // Trim the URL here
      const result = await pool.query(`
        INSERT INTO products (name, description, image_url, price, in_stock, free_shipping) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, name, description, image_url AS "imageUrl", price, in_stock AS "inStock", free_shipping AS "freeShipping"
      `, [name, description, cleanedUrl, price, inStock, freeShipping]);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  },
  
  // Fetch a single product by ID
  getProductById: async (id) => {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          description, 
          image_url AS "imageUrl", 
          price, 
          in_stock AS "inStock", 
          free_shipping AS "freeShipping" 
        FROM products 
        WHERE id = $1
      `, [id]);
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      throw err;
    }
  },

  // Update an existing product by ID
  updateProductById: async (id, updates) => {
    try {
      const fields = [];
      const values = [];
      let index = 1;
  
      Object.entries(updates).forEach(([key, value]) => {
        const sanitizedValue = key === 'imageUrl' ? value.trim() : value; // Trim the URL
        fields.push(`${key === 'imageUrl' ? 'image_url' : key} = $${index}`);
        values.push(sanitizedValue);
        index++;
      });
  
      values.push(id);
  
      const result = await pool.query(`
        UPDATE products 
        SET ${fields.join(', ')} 
        WHERE id = $${index} 
        RETURNING id, name, description, image_url AS "imageUrl", price, in_stock AS "inStock", free_shipping AS "freeShipping"
      `, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  },
  

  // Delete a product by ID
  deleteProductById: async (id) => {
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  },
};

module.exports = Product;
