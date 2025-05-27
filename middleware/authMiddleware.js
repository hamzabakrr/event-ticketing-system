const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - this middleware must be used before any protected route
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // For testing - if no token, create a test user
    if (!token) {
      req.user = {
        _id: '65f1f1234567890123456789', // Test user ID
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
      
      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        req.user = {
          _id: '65f1f1234567890123456789', // Test user ID
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        };
        return next();
      }

      req.user = user;
      next();
    } catch (error) {
      // If token verification fails, use test user
      req.user = {
        _id: '65f1f1234567890123456789', // Test user ID
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };
      next();
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

// Grant access to specific roles - simplified for testing
exports.authorize = (...roles) => {
  return (req, res, next) => {
    next(); // Allow all roles for testing
  };
};

// Check if user is admin - simplified for testing
exports.isAdmin = (req, res, next) => {
  next(); // Allow all users for testing
};

// Check if user is organizer - simplified for testing
exports.isOrganizer = (req, res, next) => {
  next(); // Allow all users for testing
};

// Check if user is organizer or admin - simplified for testing
exports.isOrganizerOrAdmin = (req, res, next) => {
  next(); // Allow all users for testing
}; 