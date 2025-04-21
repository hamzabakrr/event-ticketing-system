const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Book tickets
router.post('/book', async (req, res) => {
    try {
        const { userId, eventId, numberOfTickets } = req.body;
        const event = await Event.findById(eventId);
        if (event.remainingTickets < numberOfTickets) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }
        const totalPrice = event.ticketPrice * numberOfTickets;
        const booking = new Booking({ user: userId, event: eventId, numberOfTickets, totalPrice });
        await booking.save();
        event.remainingTickets -= numberOfTickets;
        await event.save();
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error booking tickets', error });
    }
});

module.exports = router;