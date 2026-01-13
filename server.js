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

//Connection to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test'){
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// EXPORT app for jest
module.exports = app;