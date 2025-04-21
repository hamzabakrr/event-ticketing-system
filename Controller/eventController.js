const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { name, location, date, price, availableTickets } = req.body;

  try {
    const newEvent = new Event({ name, location, date, price, availableTickets });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

const createEvent = async (req, res) => {
  try {
    const { name, location, date, ticketsAvailable, price } = req.body;

    const event = new Event({
      name, location, date, ticketsAvailable, price, organizer: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

module.exports = { createEvent, getAllEvents };

// controllers/bookingController.js
exports.createBooking = async (req, res) => {
    try {
        const { eventId, userId, numTickets } = req.body;

        // Logic to check availability, reduce ticket count, and save booking
        const booking = await Booking.create({ eventId, userId, numTickets });

        res.status(201).json({ status: 'success', data: booking });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
