const mongoose = require('mongoose');

const diaperLogSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Clean', 'Wet', 'Soiled'],
    required: [true, 'Status is required']
  },
  timeChecked: {
    type: Date,
    required: [true, 'Time checked is required'],
    default: Date.now
  },
  timeChanged: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  alertSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
diaperLogSchema.index({ child: 1, timeChanged: -1 });
diaperLogSchema.index({ caretaker: 1 });

module.exports = mongoose.model('DiaperLog', diaperLogSchema);
