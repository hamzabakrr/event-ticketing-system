const Event = require('../models/Event');
const Booking = require('../models/Booking');
const asyncHandler = require('express-async-handler');

// Get all events (public)
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single event (public)
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my events (protected)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).populate('organizer', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create event (organizer only)
const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user._id
    });
    
    await event.save();
    const populatedEvent = await Event.findById(event._id).populate('organizer', 'name');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event (organizer or admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer of this event or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    await event.save();
    
    const updatedEvent = await Event.findById(event._id).populate('organizer', 'name');
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event (organizer or admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer of this event or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.deleteOne({ _id: event._id });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book tickets for an event
// @route   POST /api/events/:id/book
// @access  Private
const bookEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const { tickets, contactInfo, totalPrice } = req.body;

  // Validate contact information
  if (!contactInfo || !contactInfo.phone) {
    res.status(400);
    throw new Error('Please provide contact information with a valid phone number');
  }

  // Validate phone number format (Egyptian number)
  const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
  if (!phoneRegex.test(contactInfo.phone)) {
    res.status(400);
    throw new Error('Please provide a valid Egyptian phone number');
  }

  // Validate tickets
  if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
    res.status(400);
    throw new Error('Please select at least one ticket');
  }

  // Validate each ticket and calculate total
  let calculatedTotal = 0;
  for (const ticket of tickets) {
    const ticketType = event.ticketTypes.id(ticket.ticketType);
    if (!ticketType) {
      res.status(400);
      throw new Error('Invalid ticket type');
    }

    if (ticketType.available < ticket.quantity) {
      res.status(400);
      throw new Error(`Not enough ${ticketType.name} tickets available`);
    }

    calculatedTotal += ticketType.price * ticket.quantity;
  }

  // Verify total price
  if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
    res.status(400);
    throw new Error('Total price mismatch');
  }

  try {
    // Create booking with confirmed status since we're skipping payment
    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      tickets: tickets.map(ticket => ({
        ticketType: ticket.ticketType,
        quantity: ticket.quantity,
        price: event.ticketTypes.id(ticket.ticketType).price
      })),
      totalAmount: totalPrice,
      contactInfo: {
        name: contactInfo.name || req.user.name,
        email: contactInfo.email || req.user.email,
        phone: contactInfo.phone
      },
      status: 'confirmed' // Set status as confirmed immediately
    });

    // Update ticket availability
    for (const ticket of tickets) {
      const ticketType = event.ticketTypes.id(ticket.ticketType);
      ticketType.available -= ticket.quantity;
    }
    await event.save();

    // Return booking with populated event details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date time location')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  bookEvent
}; 