const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 