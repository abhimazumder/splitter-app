const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
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
    }
});

module.exports = mongoose.model("Member", memberSchema);