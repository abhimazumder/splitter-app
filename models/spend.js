const mongoose = require('mongoose');

const SpendSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sessionId: {
        type: String,
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