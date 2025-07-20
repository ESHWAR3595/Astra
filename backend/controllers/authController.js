// controllers/authController.js
const pool = require('../config/db'); // Import database pool
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Register a new user
const register = async (req, res) => {
  const { username, name, email, password } = req.body;
  const userName = username || name; // Accept both username and name
  console.log('Received data:', { username, name, email, password }); // Log received data

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
        console.log('Session ID:', req.sessionID);
        
        // Save session explicitly
        req.session.save((err) => {
          if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ success: false, message: 'Session save failed' });
          }
          
          console.log('Session saved successfully');
          return res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
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
const checkSession = async (req, res) => {
  console.log('Session check - Session ID:', req.sessionID);
  console.log('Session check - User ID:', req.session.userId);
  console.log('Session check - Full session:', req.session);
  
  if (req.session && req.session.userId) {
    try {
      const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.session.userId]);
      if (result.rows.length > 0) {
        console.log('Session check - User found:', result.rows[0]);
        return res.json({ 
          isAuthenticated: true, 
          user: result.rows[0] 
        });
      } else {
        console.log('Session check - User not found in database');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    console.log('Session check - No valid session found');
  }
  
  return res.json({ isAuthenticated: false });
};

module.exports = {
  register,
  login,
  logout,
  checkSession,
};
