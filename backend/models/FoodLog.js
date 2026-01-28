const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
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
  foodType: {
    type: String,
    enum: ['Milk', 'Formula', 'Solid Food', 'Water', 'Fruit', 'Juice', 'Snack', 'Other'],
    required: [true, 'Food type is required']
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required']
  },
  unit: {
    type: String,
    enum: ['ml', 'grams', 'pieces', 'bowl', 'cup'],
    default: 'ml'
  },
  timeGiven: {
    type: Date,
    required: [true, 'Time given is required'],
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
foodLogSchema.index({ child: 1, timeGiven: -1 });
foodLogSchema.index({ caretaker: 1 });

module.exports = mongoose.model('FoodLog', foodLogSchema);
