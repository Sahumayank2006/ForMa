const FoodLog = require('../models/FoodLog');
const Child = require('../models/Child');

// @desc    Add food log
// @route   POST /api/activities/food
// @access  Private (Caretaker, Admin)
exports.addFoodLog = async (req, res, next) => {
  try {
    const { childId, foodType, quantity, unit, timeGiven, notes } = req.body;

    // Verify child exists
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    const foodLog = await FoodLog.create({
      child: childId,
      caretaker: req.user.id,
      foodType,
      quantity,
      unit,
      timeGiven: timeGiven || Date.now(),
      notes
    });

    const populatedLog = await FoodLog.findById(foodLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(201).json({
      success: true,
      message: `✅ Feeding recorded successfully for ${child.name}. Thank you for taking care!`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food logs for a child
// @route   GET /api/activities/food/child/:childId
// @access  Private
exports.getFoodLogsByChild = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { child: childId };

    if (startDate || endDate) {
      query.timeGiven = {};
      if (startDate) query.timeGiven.$gte = new Date(startDate);
      if (endDate) query.timeGiven.$lte = new Date(endDate);
    }

    const foodLogs = await FoodLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort('-timeGiven');

    res.status(200).json({
      success: true,
      count: foodLogs.length,
      data: foodLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food logs (Admin)
// @route   GET /api/activities/food/all
// @access  Private (Admin)
exports.getAllFoodLogs = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.timeGiven = {};
      if (startDate) query.timeGiven.$gte = new Date(startDate);
      if (endDate) query.timeGiven.$lte = new Date(endDate);
    }

    const foodLogs = await FoodLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort('-timeGiven')
      .limit(100);

    res.status(200).json({
      success: true,
      count: foodLogs.length,
      data: foodLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's food summary for a child
// @route   GET /api/activities/food/summary/:childId
// @access  Private
exports.getFoodSummary = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const foodLogs = await FoodLog.find({
      child: childId,
      timeGiven: { $gte: today }
    }).sort('-timeGiven');

    const summary = {
      totalFeedings: foodLogs.length,
      lastFeeding: foodLogs[0] || null,
      feedingsByType: {},
      timeSinceLastFeed: null
    };

    if (foodLogs[0]) {
      const now = new Date();
      const diff = now - new Date(foodLogs[0].timeGiven);
      summary.timeSinceLastFeed = Math.floor(diff / (1000 * 60)); // minutes
    }

    foodLogs.forEach(log => {
      if (!summary.feedingsByType[log.foodType]) {
        summary.feedingsByType[log.foodType] = 0;
      }
      summary.feedingsByType[log.foodType]++;
    });

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food log
// @route   DELETE /api/activities/food/:id
// @access  Private (Caretaker/Admin - can delete own logs or admin can delete any)
exports.deleteFoodLog = async (req, res, next) => {
  try {
    const foodLog = await FoodLog.findById(req.params.id);

    if (!foodLog) {
      return res.status(404).json({
        success: false,
        message: 'Food log not found'
      });
    }

    // Allow caretaker to delete own log or admin to delete any
    if (foodLog.caretaker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log'
      });
    }

    await foodLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food log deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
