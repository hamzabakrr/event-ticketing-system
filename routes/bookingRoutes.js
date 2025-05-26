const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createBooking,
  getBookings,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

// Public routes
router.get('/', getBookings);
router.get('/:id', getBookingById);

// Protected routes
router.use(protect); // Apply auth middleware to all routes below
router.post('/', createBooking);
router.get('/user/me', getUserBookings);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;