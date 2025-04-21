const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

router.post('/', authMiddleware.authenticateUser, authMiddleware.isOrganizer, eventController.createEvent);
router.put('/:id', authMiddleware.authenticateUser, authMiddleware.isOrganizerOrAdmin, eventController.updateEvent);
router.delete('/:id', authMiddleware.authenticateUser, authMiddleware.isOrganizerOrAdmin, eventController.deleteEvent);

module.exports = router;
const eventAdminRouter = express.Router();
const { createEvent } = require('../controllers/eventController');
const { authMiddleware, organizerMiddleware } = require('../middleware/authMiddleware');

eventAdminRouter.post('/', authMiddleware, organizerMiddleware, createEvent);
const eventPublicRouter = express.Router();
const { getAllEvents } = require('../controllers/eventController');

eventPublicRouter.get('/', getAllEvents);
const eventRouter = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventController');
const { isAuthenticated } = require('../middleware/authMiddleware');


eventRouter.post('/events', isAuthenticated, createEvent);
eventRouter.get('/events', getAllEvents);

module.exports = eventRouter;