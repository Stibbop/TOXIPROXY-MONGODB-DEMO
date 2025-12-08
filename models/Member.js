const mongoose = require('mongoose'); //Import Mongoose

//Creation of Member Schema
const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    civilStatus:{
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

//Exporting Member Model
module.exports = mongoose.model('Member', memberSchema, 'Members');