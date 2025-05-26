const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - this middleware must be used before any protected route
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
      
      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Add user and token to request
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Check if user is organizer
exports.isOrganizer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'organizer') {
    return res.status(403).json({
      message: 'Access denied. Organizer only.'
    });
  }
  next();
};

// Check if user is organizer or admin
exports.isOrganizerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Organizer or Admin only.'
    });
  }
  next();
}; 