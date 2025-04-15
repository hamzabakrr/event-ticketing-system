const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/event-ticketing', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});