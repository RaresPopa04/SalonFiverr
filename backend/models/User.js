const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    appoinments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('User', userSchema);