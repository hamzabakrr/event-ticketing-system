const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
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
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
  next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);