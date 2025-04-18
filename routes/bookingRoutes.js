const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/', authMiddleware.authenticateUser, bookingController.bookTickets);
router.delete('/:id', authMiddleware.authenticateUser, bookingController.cancelBooking);
module.exports = router;
const bookingRoutes = express.Router();
const { bookTickets, cancelBooking, getBookingById } = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/authMiddleware');
bookingRoutes.post('/bookings', isAuthenticated, bookTickets);
bookingRoutes.delete('/bookings/:bookingId', isAuthenticated, cancelBooking);
bookingRoutes.get('/bookings/:bookingId', isAuthenticated, getBookingById);
module.exports = bookingRoutes;