const mongoose = require('mongoose');

const playLogSchema = new mongoose.Schema({
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
  activityLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  playType: {
    type: String,
    enum: ['Indoor', 'Outdoor', 'Toys', 'Games', 'Creative', 'Physical', 'Other'],
    default: 'Indoor'
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true // true means child is currently playing
  },
  // For future camera/movement detection
  cameraData: {
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
playLogSchema.index({ child: 1, startTime: -1 });
playLogSchema.index({ caretaker: 1 });
playLogSchema.index({ isActive: 1 });

module.exports = mongoose.model('PlayLog', playLogSchema);
