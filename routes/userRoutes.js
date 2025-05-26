const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect, authorize, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Protected routes
router.use(protect); // All routes below this will be protected

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Admin only routes
router.get('/', isAdmin, getUsers);
router.get('/:id', isAdmin, getUserById);
router.put('/:id', isAdmin, updateUser);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;