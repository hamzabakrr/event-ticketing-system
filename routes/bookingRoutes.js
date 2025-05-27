const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Get user's booking history
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event', 'title date image location ticketTypes')
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Book tickets
router.post('/', protect, async (req, res) => {
    try {
        const { eventId, ticketType, quantity, totalPrice } = req.body;
        
        // Validate input
        if (!eventId || !ticketType || !quantity) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['eventId', 'ticketType', 'quantity']
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: 'Invalid quantity',
                details: 'Quantity must be at least 1'
            });
        }

        // Find event and check availability
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if ticket type exists and has enough availability
        const selectedTicketType = event.ticketTypes?.find(t => t.type === ticketType);
        if (!selectedTicketType) {
            return res.status(400).json({ 
                message: 'Invalid ticket type',
                availableTypes: event.ticketTypes?.map(t => t.type) || []
            });
        }

        if (selectedTicketType.available < quantity) {
            return res.status(400).json({ 
                message: 'Not enough tickets available',
                available: selectedTicketType.available,
                requested: quantity
            });
        }

        // Calculate total price
        const calculatedTotalPrice = selectedTicketType.price * quantity;
        
        // Validate total price
        if (isNaN(calculatedTotalPrice) || calculatedTotalPrice <= 0) {
            return res.status(400).json({
                message: 'Invalid total price calculation',
                details: 'Could not calculate valid total price'
            });
        }

        // Create booking
        const booking = new Booking({
            user: req.user._id,
            event: eventId,
            quantity: Number(quantity),
            totalPrice: calculatedTotalPrice,
            status: 'confirmed',
            contactInfo: {
                name: req.user.name,
                email: req.user.email
            }
        });

        // Save booking
        await booking.save();

        // Update ticket availability
        selectedTicketType.available -= quantity;
        await event.save();

        // Populate and return booking
        const populatedBooking = await booking.populate([
            { path: 'event', select: 'title date image location ticketTypes' }
        ]);

        res.status(201).json({
            message: 'Booking successful',
            booking: populatedBooking,
            remainingTickets: selectedTicketType.available
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            message: 'Error creating booking',
            details: error.message
        });
    }
});

// Cancel booking
router.patch('/:bookingId/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findOne({ 
            _id: req.params.bookingId,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update booking status
            booking.status = 'cancelled';
            await booking.save({ session });

            // Return tickets to event
            const event = await Event.findById(booking.event);
            if (event && event.ticketTypes && event.ticketTypes.length > 0) {
                const ticketType = event.ticketTypes[0];
                if (ticketType) {
                    ticketType.available += booking.quantity;
                    await event.save({ session });
                }
            }

            await session.commitTransaction();
            res.json({ 
                message: 'Booking cancelled successfully',
                booking
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
});

module.exports = router;