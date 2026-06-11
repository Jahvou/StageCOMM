const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    actions: [
        {
            label: {
                type: String,
                required: true,
            },
        },
    ],
});

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    useWheel: {
        type: Boolean,
        default: false,
    },
    buttons: [buttonSchema],
});

const layoutSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Org',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        sections: [sectionSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Layout', layoutSchema);