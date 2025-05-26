const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, ticketType, quantity, totalPrice } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find the selected ticket type
    const selectedTicket = event.ticketTypes.find(t => t.type === ticketType);
    if (!selectedTicket) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }

    // Check ticket availability
    if (selectedTicket.available < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      ticketType,
      quantity,
      totalPrice,
      status: 'confirmed'
    });

    // Update ticket availability
    selectedTicket.available -= quantity;
    await event.save();

    // Save booking
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow cancellation of confirmed bookings
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    // Update event ticket availability
    const event = await Event.findById(booking.event);
    const ticketType = event.ticketTypes.find(t => t.type === booking.ticketType);
    ticketType.available += booking.quantity;
    await event.save();

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

module.exports = router; 