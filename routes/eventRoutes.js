const express = require('express');
const router = express.Router();
const { protect, isOrganizer, isOrganizerOrAdmin } = require('../middleware/authMiddleware');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  bookEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.use(protect);

// User routes
router.get('/my/events', getMyEvents);
router.post('/:id/book', bookEvent);

// Organizer routes
router.post('/', isOrganizer, createEvent);
router.put('/:id', isOrganizerOrAdmin, updateEvent);
router.delete('/:id', isOrganizerOrAdmin, deleteEvent);

module.exports = router;