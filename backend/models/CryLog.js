const mongoose = require('mongoose');

const cryLogSchema = new mongoose.Schema({
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
  intensity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe', 'Unknown'],
    default: 'Unknown'
  },
  reason: {
    type: String,
    enum: ['Hungry', 'Diaper', 'Tired', 'Pain', 'Attention', 'Unknown'],
    default: 'Unknown'
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true // true means child is currently crying
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
cryLogSchema.index({ child: 1, createdAt: -1 });
cryLogSchema.index({ caretaker: 1 });
cryLogSchema.index({ isActive: 1 });

module.exports = mongoose.model('CryLog', cryLogSchema);
