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
  ticketType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'fawry', 'vodafone_cash'],
    required: true,
    default: 'credit_card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  contactInfo: {
    name: String,
    email: String,
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^(\+20|0)?1[0125][0-9]{8}$/.test(v);
        },
        message: props => `${props.value} is not a valid Egyptian phone number!`
      },
      required: true
    }
  },
  ticketIds: [String],
  qrCodes: [String]
}, {
  timestamps: true
});

// Add index for faster queries
bookingSchema.index({ user: 1, event: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
