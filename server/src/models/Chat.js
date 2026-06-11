const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true,
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);