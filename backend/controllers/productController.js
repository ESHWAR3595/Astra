const Product = require('../models/Product');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAllProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    
    if (isNaN(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID" 
      });
    }

    try {
      const product = await Product.getProductById(productId);
      
      if (product) {
        res.json({
          success: true,
          data: product
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching product details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = productController; 