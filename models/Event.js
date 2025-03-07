const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        enum: ['Concert', 'Conference', 'Workshop', 'Festival'], 
        required: true 
    },
    image: { type: String, default: '' },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalTickets: { type: Number, required: true, min: 0 },
    remainingTickets: { type: Number, required: true, min: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
