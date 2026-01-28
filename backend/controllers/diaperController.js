const DiaperLog = require('../models/DiaperLog');
const Child = require('../models/Child');

// @desc    Add diaper log
// @route   POST /api/activities/diaper
// @access  Private (Caretaker, Admin)
exports.addDiaperLog = async (req, res, next) => {
  try {
    const { childId, status, timeChecked, timeChanged, notes } = req.body;

    // Verify child exists
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    const diaperLog = await DiaperLog.create({
      child: childId,
      caretaker: req.user.id,
      status,
      timeChecked: timeChecked || Date.now(),
      timeChanged: timeChanged || Date.now(),
      notes
    });

    const populatedLog = await DiaperLog.findById(diaperLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(201).json({
      success: true,
      message: `🧷 Diaper status updated for ${child.name}. Hygiene is on track!`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete diaper log
// @route   DELETE /api/activities/diaper/:id
// @access  Private (Caretaker who created it, Admin)
exports.deleteDiaperLog = async (req, res, next) => {
  try {
    const diaperLog = await DiaperLog.findById(req.params.id);

    if (!diaperLog) {
      return res.status(404).json({
        success: false,
        message: 'Diaper log not found'
      });
    }

    // Check if user is the caretaker who created it or admin
    if (diaperLog.caretaker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log'
      });
    }

    await diaperLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Diaper log deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get diaper logs for a child
// @route   GET /api/activities/diaper/child/:childId
// @access  Private
exports.getDiaperLogsByChild = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { child: childId };

    if (startDate || endDate) {
      query.timeChanged = {};
      if (startDate) query.timeChanged.$gte = new Date(startDate);
      if (endDate) query.timeChanged.$lte = new Date(endDate);
    }

    const diaperLogs = await DiaperLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort('-timeChanged');

    res.status(200).json({
      success: true,
      count: diaperLogs.length,
      data: diaperLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all diaper logs (Admin)
// @route   GET /api/activities/diaper/all
// @access  Private (Admin)
exports.getAllDiaperLogs = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.timeChanged = {};
      if (startDate) query.timeChanged.$gte = new Date(startDate);
      if (endDate) query.timeChanged.$lte = new Date(endDate);
    }

    const diaperLogs = await DiaperLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort('-timeChanged')
      .limit(100);

    res.status(200).json({
      success: true,
      count: diaperLogs.length,
      data: diaperLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get diaper summary for a child
// @route   GET /api/activities/diaper/summary/:childId
// @access  Private
exports.getDiaperSummary = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diaperLogs = await DiaperLog.find({
      child: childId,
      timeChanged: { $gte: today }
    }).sort('-timeChanged').populate('caretaker', 'name');

    const lastLog = diaperLogs[0];
    let timeSinceLastChange = null;
    let alertLevel = 'green'; // green, yellow, red

    if (lastLog) {
      const now = new Date();
      const diff = now - new Date(lastLog.timeChanged);
      timeSinceLastChange = Math.floor(diff / (1000 * 60)); // minutes

      // Alert logic
      if (timeSinceLastChange > 180) { // 3 hours
        alertLevel = 'red';
      } else if (timeSinceLastChange > 120) { // 2 hours
        alertLevel = 'yellow';
      }
    }

    // Calculate daily stats
    let averageInterval = 0;
    if (diaperLogs.length > 1) {
      let totalIntervals = 0;
      for (let i = 0; i < diaperLogs.length - 1; i++) {
        const diff = new Date(diaperLogs[i].timeChanged) - new Date(diaperLogs[i + 1].timeChanged);
        totalIntervals += diff / (1000 * 60); // minutes
      }
      averageInterval = Math.floor(totalIntervals / (diaperLogs.length - 1));
    }

    // Get last rash note if any
    const lastRashNote = diaperLogs.find(log => log.notes && log.notes.toLowerCase().includes('rash'));

    const summary = {
      totalChanges: diaperLogs.length,
      lastChange: lastLog || null,
      timeSinceLastChange,
      alertLevel,
      currentStatus: lastLog ? lastLog.status : 'Unknown',
      dailyStats: {
        totalChangesToday: diaperLogs.length,
        averageInterval,
        lastRashNote: lastRashNote ? lastRashNote.notes : null
      }
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check for overdue diapers (for alert system)
// @route   GET /api/activities/diaper/check-overdue
// @access  Private (Admin, System)
exports.checkOverdueDiapers = async (req, res, next) => {
  try {
    const children = await Child.find({ isActive: true });
    const overdueAlerts = [];

    for (const child of children) {
      const lastLog = await DiaperLog.findOne({ child: child._id })
        .sort('-timeChanged')
        .populate('child', 'name childId mother')
        .populate('caretaker', 'name');

      if (lastLog) {
        const now = new Date();
        const diff = now - new Date(lastLog.timeChanged);
        const hoursSinceChange = diff / (1000 * 60 * 60);

        if (hoursSinceChange > 3) {
          overdueAlerts.push({
            child: child,
            lastChange: lastLog,
            hoursSinceChange: hoursSinceChange.toFixed(1),
            message: `⚠ Diaper change overdue for ${child.name} (${hoursSinceChange.toFixed(1)}h ago)`
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: overdueAlerts.length,
      data: overdueAlerts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete diaper log
// @route   DELETE /api/activities/diaper/:id
// @access  Private (Caretaker/Admin - can delete own logs or admin can delete any)
exports.deleteDiaperLog = async (req, res, next) => {
  try {
    const diaperLog = await DiaperLog.findById(req.params.id);

    if (!diaperLog) {
      return res.status(404).json({
        success: false,
        message: 'Diaper log not found'
      });
    }

    // Allow caretaker to delete own log or admin to delete any
    if (diaperLog.caretaker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log'
      });
    }

    await diaperLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Diaper log deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
