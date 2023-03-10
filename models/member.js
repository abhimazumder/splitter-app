const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
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
    }
});

module.exports = mongoose.model("Member", memberSchema);