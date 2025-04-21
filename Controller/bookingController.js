const Booking = require('../models/Booking');
const Event = require('../models/Event');

const bookTickets = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ message: 'Insufficient tickets available' });
    }

    const totalPrice = tickets * event.price;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      tickets,
      totalPrice,
    });

    await booking.save();

    event.ticketsAvailable -= tickets;
    await event.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error booking tickets', error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    const event = await Event.findById(booking.event);
    event.ticketsAvailable += booking.tickets;
    await event.save();

    await booking.remove();

    res.json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error canceling booking', error: err.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking details', error: err.message });
  }
};

module.exports = { bookTickets, cancelBooking, getBookingById };

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ status: 'success', data: booking });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ status: 'success', message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
