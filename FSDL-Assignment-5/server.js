const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/futuristic_travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  // Seed sample data if empty
  const count = await Destination.countDocuments();
  if (count === 0) {
    await Destination.insertMany([
      { name: 'Mars Colony Alpha', location: 'Mars', price: 25000, description: 'Experience the red planet from our state-of-the-art dome city.', image: '/assets/mars.jpg' },
      { name: 'Lunar Gateway', location: 'Moon', price: 8000, description: 'The ultimate zero-gravity resort with spectacular Earth views.', image: '/assets/moon.jpg' },
      { name: 'Europa Ice Caves', location: 'Jupiter', price: 45000, description: 'Dive deep into the frozen subterranean oceans of Jupiter’s moon.', image: '/assets/europa.jpg' },
      { name: 'Saturn Rings Cruise', location: 'Saturn', price: 60000, description: 'A magical journey orbiting through the rings of Saturn.', image: '/assets/saturn.jpg' }
    ]);
    console.log('Seeded initial destinations.');
  }
}).catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

app.post('/api/booking', async (req, res) => {
  try {
    const { name, destination, date } = req.body;
    const newBooking = new Booking({ name, destination, date });
    await newBooking.save();
    res.status(201).json({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
