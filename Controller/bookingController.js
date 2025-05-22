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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookTicketForm = ({ eventId, ticketPrice, maxAvailable }) => {
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(ticketPrice);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setTotalPrice(quantity * ticketPrice);
    }, [quantity, ticketPrice]);

    const handleBooking = async () => {
        if (quantity > maxAvailable) {
            setMessage('Not enough tickets available.');
            return;
        }

        try {
            const response = await axios.post('/api/bookings', {
                eventId,
                quantity,
            });

            setMessage('Booking successful!');
        } catch (error) {
            setMessage('Booking failed: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <div>
            <h2>Book Tickets</h2>
            <label>Quantity: </label>
            <input
                type="number"
                value={quantity}
                min={1}
                max={maxAvailable}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <p>Total Price: ${totalPrice}</p>
            <button onClick={handleBooking}>Book</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BookTicketForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        const res = await axios.get('/api/bookings');
        setBookings(res.data);
    };

    const cancelBooking = async (id) => {
        await axios.delete(`/api/bookings/${id}`);
        fetchBookings(); // Refresh
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div>
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            <strong>{booking.eventName}</strong><br />
                            Quantity: {booking.quantity}<br />
                            Total Price: ${booking.price}<br />
                            <button onClick={() => cancelBooking(booking.id)}>Cancel</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserBookingsPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingDetails = ({ bookingId, onClose }) => {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await axios.get(`/api/bookings/${bookingId}`);
            setDetails(res.data);
        };

        fetchDetails();
    }, [bookingId]);

    if (!details) return <p>Loading...</p>;

    return (
        <div className="modal">
            <h3>Booking Details</h3>
            <p>Event: {details.eventName}</p>
            <p>Quantity: {details.quantity}</p>
            <p>Total Price: ${details.price}</p>
            <p>Booking Date: {new Date(details.createdAt).toLocaleString()}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default BookingDetails;

