const express = require('express');
const router = express.Router();
const { protect, isOrganizer, isOrganizerOrAdmin } = require('../middleware/authMiddleware');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.use(protect);

// Organizer routes
router.post('/', isOrganizer, createEvent);
router.put('/:id', isOrganizerOrAdmin, updateEvent);
router.delete('/:id', isOrganizerOrAdmin, deleteEvent);

module.exports = router;