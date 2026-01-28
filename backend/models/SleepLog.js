const mongoose = require('mongoose');

const sleepLogSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'Child reference is required']
  },
  caretaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Caretaker reference is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  quality: {
    type: String,
    enum: ['Deep', 'Light', 'Restless', 'Unknown'],
    default: 'Unknown'
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true // true means child is currently sleeping
  },
  // For future smartwatch integration
  deviceData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
sleepLogSchema.index({ child: 1, startTime: -1 });
sleepLogSchema.index({ caretaker: 1 });
sleepLogSchema.index({ isActive: 1 });

module.exports = mongoose.model('SleepLog', sleepLogSchema);
