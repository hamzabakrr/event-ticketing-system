const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
      enum: ['Cairo', 'Alexandria', 'Giza']
    },
    area: {
      type: String,
      required: true,
      enum: ['Nasr City', 'Maadi', 'Heliopolis', 'Downtown', 'Zamalek', 'New Cairo', '6th of October', 'Borg El Arab']
    }
  },
  category: {
    type: String,
    enum: ['Concert', 'Sports', 'Theater', 'Conference', 'Exhibition', 'Festival'],
    required: true
  },
  ticketTypes: [{
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    }
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Add index for searching
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
