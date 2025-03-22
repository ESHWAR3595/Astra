// controllers/authController.js
const pool = require('../config/db'); // Import database pool
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Received data:', { name, email, password }); // Log received data

  try {
    if (typeof password !== 'string') {
      return res.status(400).json({ error: 'Password must be a string' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );

    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Clear any previous session
  req.session.userId = null;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.userId = user.id; // Save user ID in session
        console.log('User logged in with ID:', req.session.userId);
        return res.status(200).json({ message: 'Login successful' });
      }
    }
    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout a user
const logout = (req, res) => {
  console.log('Attempting to logout user with session:', req.session);
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    console.log('Logout successful, session destroyed.');
    res.status(200).json({ message: 'Logout successful' });
  });
};

// Check session
const checkSession = (req, res) => {
  if (req.session.userId) {
    return res.json({ isAuthenticated: true });
  }
  return res.json({ isAuthenticated: false });
};

module.exports = {
  register,
  login,
  logout,
  checkSession,
};
