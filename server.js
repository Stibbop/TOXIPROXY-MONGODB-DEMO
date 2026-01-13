const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();  

const app = express();
app.use(express.json());

// Hello World endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});
// Cebu Pacific endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Cebu Pacific 2026!' });
});
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Routes
const memberRoutes = require('./routes/MemberRoutes')
app.use('/members', memberRoutes);

// MongoDB connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined! Please set it in Vercel Environment Variables.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;