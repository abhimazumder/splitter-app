const mongoose = require('mongoose');

const SpendSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    memberName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    item: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Spend", SpendSchema);