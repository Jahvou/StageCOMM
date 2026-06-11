const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
    {
        org:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true,
        },
        sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        clearedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        section: {
            type: String,
            required: true,
        },
        button: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'cleared'],
            default: 'active',
        },
        clearedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);