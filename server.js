const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();  

const app = express();
app.use(express.json());

//Connection to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongDB connection error:', err));

// Routes
const memberRoutes = require('./routes/MemberRoutes')
app.use('/members', memberRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));

