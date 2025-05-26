const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  tickets: [{
    ticketType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event.ticketTypes',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'fawry', 'vodafone_cash'],
    default: 'credit_card'
  },
  contactInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^(\+20|0)?1[0125][0-9]{8}$/, 'Please provide a valid Egyptian phone number']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
bookingSchema.index({ user: 1, event: 1, createdAt: -1 });

// Virtual for total quantity
bookingSchema.virtual('totalQuantity').get(function() {
  return this.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
});

// Pre-save hook to validate total amount
bookingSchema.pre('save', function(next) {
  const calculatedTotal = this.tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
  if (Math.abs(calculatedTotal - this.totalAmount) > 0.01) {
    next(new Error('Total amount mismatch'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
