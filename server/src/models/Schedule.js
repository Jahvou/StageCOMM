const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
});

const scheduleSchema = new mongoose.Schema(
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
    items: [scheduleItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);