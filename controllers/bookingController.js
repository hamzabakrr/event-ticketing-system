const Booking = require('../models/Booking');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// Get all bookings
exports.getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('event', 'title date');
  res.json(bookings);
});

// Get booking by ID
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('event', 'title date');
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  res.json(booking);
});

// Get user's bookings
exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event', 'title date location ticketTypes')
    .sort('-createdAt');
  res.json(bookings);
});

// Create booking
exports.createBooking = asyncHandler(async (req, res) => {
  const { eventId, tickets, contactInfo } = req.body;

  if (!eventId || !tickets || !contactInfo) {
    res.status(400);
    throw new Error('Please provide all required booking information');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Calculate total price and validate ticket availability
  let totalPrice = 0;
  for (const ticket of tickets) {
    const ticketType = event.ticketTypes.find(t => t._id.toString() === ticket.ticketType);
    if (!ticketType) {
      res.status(400);
      throw new Error('Invalid ticket type');
    }
    if (ticketType.quantity < ticket.quantity) {
      res.status(400);
      throw new Error(`Not enough ${ticketType.name} tickets available`);
    }
    totalPrice += ticketType.price * ticket.quantity;
  }

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    tickets,
    contactInfo,
    totalPrice
  });

  // Update ticket quantities
  for (const ticket of tickets) {
    const ticketType = event.ticketTypes.find(t => t._id.toString() === ticket.ticketType);
    ticketType.quantity -= ticket.quantity;
  }
  await event.save();

  // Populate booking with event and user details
  await booking.populate('event', 'title date location ticketTypes');
  await booking.populate('user', 'name email');

  res.status(201).json(booking);
});

// Update booking
exports.updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  // Check if user owns the booking or is admin
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }
  
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('event', 'title date');
  
  res.json(updatedBooking);
});

// Delete booking
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  // Check if user owns the booking or is admin
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this booking');
  }
  
  await booking.remove();
  res.json({ message: 'Booking removed' });
}); 