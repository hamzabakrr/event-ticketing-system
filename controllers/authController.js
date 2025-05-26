const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register user
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'user',
      phone,
      address = {
        street: '',
        area: 'Other',
        city: 'Cairo'
      }
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, and phone' 
      });
    }

    // Check if user exists (case-insensitive)
    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ 
      email: normalizedEmail 
    }).collation({ locale: 'en', strength: 2 });

    console.log('Checking for existing user with email:', normalizedEmail);
    if (user) {
      console.log('Found existing user:', user.email);
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    console.log('Creating new user with email:', normalizedEmail);
    // Create new user
    user = new User({
      name,
      email: normalizedEmail,
      password,
      role,
      phone,
      address
    });

    // Save user to database
    await user.save();
    console.log('Successfully created new user:', user.email);

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password' 
      });
    }

    // Check if user exists (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).collation({ locale: 'en', strength: 2 });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password using the schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// Get current user
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }
    
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).collation({ locale: 'en', strength: 2 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the user document
    // 3. Send an email with the reset link

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
}; 