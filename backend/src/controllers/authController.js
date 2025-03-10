const AuthService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const { user, token } = await AuthService.register(email, password);

    res.status(201).json({
      message: 'Registration successful! Please login to continue.',
      user: { email: user.email },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed. Please try again later.',
      details: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, token } = await AuthService.login(email, password);

    res.json({
      message: 'Login successful',
      user: { email: user.email },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      message: 'Login failed. Please check your credentials and try again.',
      details: error.message,
    });
  }
};

module.exports = { register, login };
