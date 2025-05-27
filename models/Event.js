const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Concert', 'Sports', 'Theater', 'Festival', 'Exhibition']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  location: {
    name: {
      type: String,
      required: [true, 'Please add a venue name']
    },
    area: {
      type: String,
      required: [true, 'Please add an area'],
      enum: ['Nasr City', 'Maadi', 'Heliopolis', 'Downtown', 'Zamalek', 'New Cairo', '6th of October', 'Borg El Arab']
    },
    city: {
      type: String,
      default: 'Cairo'
    }
  },
  ticketTypes: [{
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    available: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total available tickets
eventSchema.virtual('totalAvailable').get(function() {
  return this.ticketTypes?.reduce((total, type) => total + (type.available || 0), 0) || 0;
});

// Virtual for ticket availability status
eventSchema.virtual('ticketAvailability').get(function() {
  const total = this.totalAvailable;
  if (total === 0) {
    return 'Sold Out';
  }
  if (total <= 5) {
    return `Only ${total} tickets left`;
  }
  return `${total} tickets available`;
});

// Method to check ticket availability
eventSchema.methods.hasAvailableTickets = function(ticketType, quantity) {
  if (!this.ticketTypes || !Array.isArray(this.ticketTypes) || this.ticketTypes.length === 0) {
    console.warn(`No ticket types found for event ${this._id}`);
    return false;
  }
  
  const ticketTypeObj = this.ticketTypes.find(t => t.type === ticketType);
  if (!ticketTypeObj) {
    console.warn(`Ticket type ${ticketType} not found for event ${this._id}`);
    return false;
  }
  
  return ticketTypeObj.available >= quantity;
};

// Method to get ticket price
eventSchema.methods.getTicketPrice = function(ticketType) {
  if (!this.ticketTypes || !Array.isArray(this.ticketTypes) || this.ticketTypes.length === 0) {
    console.warn(`No ticket types found for event ${this._id}`);
    return 0;
  }
  
  const ticketTypeObj = this.ticketTypes.find(t => t.type === ticketType);
  if (!ticketTypeObj) {
    console.warn(`Ticket type ${ticketType} not found for event ${this._id}`);
    return 0;
  }
  
  return ticketTypeObj.price;
};

// Method to update ticket availability
eventSchema.methods.updateTicketAvailability = function(ticketType, quantity) {
  if (!this.ticketTypes || !Array.isArray(this.ticketTypes) || this.ticketTypes.length === 0) {
    console.warn(`No ticket types found for event ${this._id}`);
    return false;
  }
  
  const ticketTypeObj = this.ticketTypes.find(t => t.type === ticketType);
  if (!ticketTypeObj || ticketTypeObj.available < quantity) {
    console.warn(`Cannot update availability for ticket type ${ticketType} of event ${this._id}`);
    return false;
  }
  
  ticketTypeObj.available -= quantity;
  return true;
};

// Set remaining tickets equal to total tickets when creating new event
eventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.remainingTickets = this.totalTickets;
  }
  next();
});

// Add index for searching
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
