const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();  

const app = express();
app.use(express.json());

//Connection to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test'){
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongDB connection error:', err));

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server running on port', process.env.PORT || 3000);
    });
}
// Routes
const memberRoutes = require('./routes/MemberRoutes')
app.use('/members', memberRoutes);

// EXPORT app for jest
module.exports = app;