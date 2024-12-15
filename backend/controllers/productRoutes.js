const express = require('express');
const Product = require('../models/Product');  // Product model
const router = express.Router();

// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.getAllProducts(); // Correct function name
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error); // Improved error logging
    res.status(500).json({ message: error.message });
  }
});

// POST a new product
router.post('/products', async (req, res) => {
  const { name, description, imageUrl } = req.body;

  try {
    // Add a createProduct function to your Product model if it doesn't exist yet
    const newProduct = await Product.createProduct({
      name,
      description,
      imageUrl,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error); // Improved error logging
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
