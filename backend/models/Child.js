const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  childId: {
    type: String,
    required: [true, 'Child ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0,
    max: 18
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  photo: {
    type: String,
    default: null
  },
  // Mother reference
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mother is required']
  },
  // Assigned caretaker
  assignedCaretaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Room/location assignment
  assignedRoom: {
    type: String,
    trim: true,
    default: null
  },
  // Camera ID for monitoring
  assignedCamera: {
    type: String,
    trim: true,
    default: null
  },
  // Microphone ID for monitoring
  assignedMic: {
    type: String,
    trim: true,
    default: null
  },
  // Additional information
  allergies: [{
    type: String,
    trim: true
  }],
  medicalConditions: [{
    type: String,
    trim: true
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For future AI features
  activityLogs: [{
    timestamp: Date,
    activity: String,
    detectedBy: String, // 'manual', 'camera', 'mic', 'sensor'
    metadata: mongoose.Schema.Types.Mixed
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
childSchema.index({ mother: 1 });
childSchema.index({ assignedCaretaker: 1 });

// Method to get child profile with populated references
childSchema.methods.getFullProfile = async function() {
  return await this.populate([
    { path: 'mother', select: 'name email phone profilePhoto' },
    { path: 'assignedCaretaker', select: 'name email phone profilePhoto' }
  ]);
};

module.exports = mongoose.model('Child', childSchema);
