const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(\+20|0)?1[0125][0-9]{8}$/.test(v);
      },
      message: props => `${props.value} is not a valid Egyptian phone number!`
    },
    required: true
  },
  address: {
    street: String,
    area: {
      type: String,
      enum: ['Maadi', 'Heliopolis', 'Nasr City', 'New Cairo', 'Downtown', '6th of October', 'Zamalek', 'Other']
    },
    city: {
      type: String,
      default: 'Cairo'
    }
  },
  profileImage: {
    type: String,
    default: 'default-avatar.jpg'
  },
  savedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['booking', 'event_update', 'payment', 'reminder']
    },
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);