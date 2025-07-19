const pool = require('./config/db');

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');

    // Create products table with proper schema
    await pool.query(`
      DROP TABLE IF EXISTS products CASCADE;
      
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        stock INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT true,
        free_shipping BOOLEAN DEFAULT false,
        category VARCHAR(100) DEFAULT 'Electronics',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Products table created successfully');

    // Insert products with proper prices
    const products = [
      {
        name: 'Boat Earphones Omesh',
        description: 'High-quality wireless earphones with premium sound quality and comfortable fit',
        price: 19.99,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        stock: 10,
        in_stock: true,
        category: 'Audio'
      },
      {
        name: 'Noise Earphones',
        description: 'Active noise cancellation earphones perfect for music lovers',
        price: 29.99,
        image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
        stock: 15,
        in_stock: true,
        category: 'Audio'
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking smartwatch with health monitoring',
        price: 199.99,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        stock: 8,
        in_stock: true,
        category: 'Wearables'
      },
      {
        name: 'Wireless Speaker',
        description: 'Portable Bluetooth speaker with crystal clear sound',
        price: 79.99,
        image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        stock: 12,
        in_stock: true,
        category: 'Audio'
      },
      {
        name: 'Gaming Mouse',
        description: 'High-precision gaming mouse with customizable RGB lighting',
        price: 59.99,
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        stock: 20,
        in_stock: true,
        category: 'Gaming'
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Premium mechanical keyboard with tactile switches',
        price: 129.99,
        image_url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
        stock: 6,
        in_stock: true,
        category: 'Accessories'
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 39.99,
        image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
        stock: 25,
        in_stock: true,
        category: 'Accessories'
      },
      {
        name: 'USB-C Hub',
        description: 'Multi-port USB-C hub for laptop connectivity',
        price: 24.99,
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
        stock: 30,
        in_stock: true,
        category: 'Accessories'
      },
      {
        name: 'Wireless Charger',
        description: 'Fast wireless charging pad for smartphones',
        price: 34.99,
        image_url: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400&h=400&fit=crop',
        stock: 18,
        in_stock: true,
        category: 'Charging'
      },
      {
        name: 'Bluetooth Headphones',
        description: 'Over-ear wireless headphones with noise cancellation',
        price: 89.99,
        image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
        stock: 10,
        in_stock: true,
        category: 'Audio'
      },
      {
        name: 'Phone Case',
        description: 'Durable protective case for smartphones',
        price: 19.99,
        image_url: 'https://images.unsplash.com/photo-1603313011628-cf0269944e1c?w=400&h=400&fit=crop',
        stock: 40,
        in_stock: true,
        category: 'Accessories'
      },
      {
        name: 'Power Bank',
        description: 'High-capacity portable charger for mobile devices',
        price: 49.99,
        image_url: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=400&fit=crop',
        stock: 14,
        in_stock: true,
        category: 'Charging'
      },
      {
        name: 'Webcam HD',
        description: 'High-definition webcam for video conferencing',
        price: 69.99,
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        stock: 7,
        in_stock: true,
        category: 'Accessories'
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        price: 29.99,
        image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
        stock: 22,
        in_stock: true,
        category: 'Accessories'
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug with thermal insulation',
        price: 14.99,
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        stock: 35,
        in_stock: true,
        category: 'Lifestyle'
      },
      {
        name: 'Notebook Set',
        description: 'Premium quality notebooks for writing and notes',
        price: 9.99,
        image_url: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop',
        stock: 50,
        in_stock: true,
        category: 'Office'
      },
      {
        name: 'Pen Set',
        description: 'Professional pen set with multiple colors',
        price: 12.99,
        image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc36b60?w=400&h=400&fit=crop',
        stock: 28,
        in_stock: true,
        category: 'Office'
      },
      {
        name: 'Desk Organizer',
        description: 'Multi-compartment desk organizer for office supplies',
        price: 19.99,
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
        stock: 16,
        in_stock: true,
        category: 'Office'
      },
      {
        name: 'Water Bottle',
        description: 'Stainless steel insulated water bottle',
        price: 24.99,
        image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        stock: 20,
        in_stock: true,
        category: 'Lifestyle'
      }
    ];

    // Insert products
    for (const product of products) {
      await pool.query(`
        INSERT INTO products (name, description, image_url, price, stock, in_stock, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        product.name,
        product.description,
        product.image_url,
        product.price,
        product.stock,
        product.in_stock,
        product.category
      ]);
    }

    console.log(`${products.length} products inserted successfully`);

    // Verify the data
    const result = await pool.query('SELECT id, name, price FROM products ORDER BY id');
    console.log('Database verification:');
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Price: $${row.price}`);
    });

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase; 