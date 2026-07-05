const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                role: {
                    type: String,
                    enum: ['director', 'admin', 'stage_manager', 'technician', 'performer', 'team_member'],
                    default: 'performer',
                },
            },
        ],
        inviteToken: {
            type: String,
            default: null,
        },
        inviteTokenExpiry: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Org', orgSchema);