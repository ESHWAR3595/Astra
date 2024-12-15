const express = require('express');
const Product = require('../models/Product'); // Product model
const router = express.Router();

// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// POST a new product
router.post('/products', async (req, res) => {
    const { name, description, imageUrl, price = 0.0, inStock = true, freeShipping = false } = req.body;
  
    try {
      const cleanedUrl = imageUrl.trim(); // Trim the URL
      const newProduct = await Product.createProduct({
        name,
        description,
        imageUrl: cleanedUrl, // Use the sanitized URL
        price,
        inStock,
        freeShipping,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ message: 'Error creating product' });
    }
  });
  

module.exports = router;
