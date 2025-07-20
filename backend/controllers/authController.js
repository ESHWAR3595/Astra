// controllers/authController.js
const pool = require('../config/db'); // Import database pool
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const crypto = require('crypto'); // For generating tokens

// Store active tokens in memory (in production, use Redis)
const activeTokens = new Map();

// Register a new user
const register = async (req, res) => {
  const { username, name, email, password } = req.body;
  const userName = username || name; // Accept both username and name
  console.log('Received data:', { username, name, email, password });

  try {
    if (typeof password !== 'string') {
      return res.status(400).json({ error: 'Password must be a string' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [userName, email, hashedPassword]
    );

    const newUser = result.rows[0];
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Generate a token
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        
        // Store token in memory
        activeTokens.set(token, {
          userId: user.id,
          email: user.email,
          expiry: tokenExpiry
        });
        
        console.log('User logged in with ID:', user.id);
        console.log('Token generated:', token);
        
        return res.status(200).json({ 
          success: true, 
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          },
          token: token,
          expiresAt: tokenExpiry
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Logout a user
const logout = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token && activeTokens.has(token)) {
    activeTokens.delete(token);
    console.log('User logged out, token removed');
  }
  
  res.status(200).json({ message: 'Logout successful' });
};

// Check session/token
const checkSession = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  
  console.log('Token check - Token:', token ? 'present' : 'missing');
  
  if (token && activeTokens.has(token)) {
    const tokenData = activeTokens.get(token);
    
    // Check if token is expired
    if (Date.now() > tokenData.expiry) {
      activeTokens.delete(token);
      console.log('Token expired, removed');
      return res.json({ isAuthenticated: false });
    }
    
    try {
      const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [tokenData.userId]);
      if (result.rows.length > 0) {
        console.log('Token check - User found:', result.rows[0]);
        return res.json({ 
          isAuthenticated: true, 
          user: result.rows[0] 
        });
      } else {
        console.log('Token check - User not found in database');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    console.log('Token check - No valid token found');
  }
  
  return res.json({ isAuthenticated: false });
};

module.exports = {
  register,
  login,
  logout,
  checkSession,
};
