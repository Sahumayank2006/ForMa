const SleepLog = require('../models/SleepLog');
const PlayLog = require('../models/PlayLog');
const CryLog = require('../models/CryLog');
const Child = require('../models/Child');

// ========== SLEEP CONTROLLERS ==========

// @desc    Start sleep session
// @route   POST /api/activities/sleep/start
// @access  Private (Caretaker, Admin)
exports.startSleep = async (req, res, next) => {
  try {
    const { childId, startTime, notes } = req.body;

    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Check if there's an active sleep session
    const activeSleep = await SleepLog.findOne({ child: childId, isActive: true });
    if (activeSleep) {
      return res.status(400).json({
        success: false,
        message: 'Child already has an active sleep session'
      });
    }

    const sleepLog = await SleepLog.create({
      child: childId,
      caretaker: req.user.id,
      startTime: startTime || Date.now(),
      notes,
      isActive: true
    });

    const populatedLog = await SleepLog.findById(sleepLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(201).json({
      success: true,
      message: `😴 Sleep time started for ${child.name}`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End sleep session
// @route   PUT /api/activities/sleep/end/:id
// @access  Private (Caretaker, Admin)
exports.endSleep = async (req, res, next) => {
  try {
    const { quality, endTime, notes } = req.body;

    const sleepLog = await SleepLog.findById(req.params.id);
    if (!sleepLog) {
      return res.status(404).json({
        success: false,
        message: 'Sleep log not found'
      });
    }

    const actualEndTime = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((actualEndTime - new Date(sleepLog.startTime)) / (1000 * 60)); // minutes

    sleepLog.endTime = actualEndTime;
    sleepLog.duration = duration;
    sleepLog.quality = quality || sleepLog.quality;
    sleepLog.notes = notes || sleepLog.notes;
    sleepLog.isActive = false;

    await sleepLog.save();

    const populatedLog = await SleepLog.findById(sleepLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(200).json({
      success: true,
      message: `😴 Sleep session ended. Duration: ${duration} minutes`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sleep logs for a child
// @route   GET /api/activities/sleep/child/:childId
// @access  Private
exports.getSleepLogsByChild = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { child: childId };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const sleepLogs = await SleepLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort('-startTime');

    res.status(200).json({
      success: true,
      count: sleepLogs.length,
      data: sleepLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sleep summary
// @route   GET /api/activities/sleep/summary/:childId
// @access  Private
exports.getSleepSummary = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sleepLogs = await SleepLog.find({
      child: childId,
      startTime: { $gte: today }
    }).sort('-startTime');

    const totalDuration = sleepLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const activeSleep = sleepLogs.find(log => log.isActive);

    let currentSleepDuration = 0;
    if (activeSleep) {
      const now = new Date();
      const diff = now - new Date(activeSleep.startTime);
      currentSleepDuration = Math.floor(diff / (1000 * 60)); // minutes
    }

    const summary = {
      totalSessions: sleepLogs.length,
      totalSleepToday: totalDuration, // minutes
      averageDuration: sleepLogs.length > 0 ? Math.floor(totalDuration / sleepLogs.length) : 0,
      isCurrentlySleeping: !!activeSleep,
      currentSleepDuration,
      activeSleep: activeSleep || null,
      lastSleep: sleepLogs[0] || null
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// ========== PLAY CONTROLLERS ==========

// @desc    Start play session
// @route   POST /api/activities/play/start
// @access  Private (Caretaker, Admin)
exports.startPlay = async (req, res, next) => {
  try {
    const { childId, playType, activityLevel, startTime, notes } = req.body;

    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Check if there's an active play session
    const activePlay = await PlayLog.findOne({ child: childId, isActive: true });
    if (activePlay) {
      return res.status(400).json({
        success: false,
        message: 'Child already has an active play session'
      });
    }

    const playLog = await PlayLog.create({
      child: childId,
      caretaker: req.user.id,
      playType: playType || 'Indoor',
      activityLevel: activityLevel || 'Medium',
      startTime: startTime || Date.now(),
      notes,
      isActive: true
    });

    const populatedLog = await PlayLog.findById(playLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(201).json({
      success: true,
      message: `🎈 Play session recorded for ${child.name}`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End play session
// @route   PUT /api/activities/play/end/:id
// @access  Private (Caretaker, Admin)
exports.endPlay = async (req, res, next) => {
  try {
    const { endTime, notes } = req.body;

    const playLog = await PlayLog.findById(req.params.id);
    if (!playLog) {
      return res.status(404).json({
        success: false,
        message: 'Play log not found'
      });
    }

    const actualEndTime = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((actualEndTime - new Date(playLog.startTime)) / (1000 * 60)); // minutes

    playLog.endTime = actualEndTime;
    playLog.duration = duration;
    playLog.notes = notes || playLog.notes;
    playLog.isActive = false;

    await playLog.save();

    const populatedLog = await PlayLog.findById(playLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(200).json({
      success: true,
      message: `🎈 Play session ended. Duration: ${duration} minutes`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get play logs for a child
// @route   GET /api/activities/play/child/:childId
// @access  Private
exports.getPlayLogsByChild = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { child: childId };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const playLogs = await PlayLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort('-startTime');

    res.status(200).json({
      success: true,
      count: playLogs.length,
      data: playLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get play summary
// @route   GET /api/activities/play/summary/:childId
// @access  Private
exports.getPlaySummary = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const playLogs = await PlayLog.find({
      child: childId,
      startTime: { $gte: today }
    }).sort('-startTime');

    const totalDuration = playLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const activePlay = playLogs.find(log => log.isActive);

    let currentPlayDuration = 0;
    if (activePlay) {
      const now = new Date();
      const diff = now - new Date(activePlay.startTime);
      currentPlayDuration = Math.floor(diff / (1000 * 60)); // minutes
    }

    const summary = {
      totalSessions: playLogs.length,
      totalPlayToday: totalDuration, // minutes
      averageDuration: playLogs.length > 0 ? Math.floor(totalDuration / playLogs.length) : 0,
      isCurrentlyPlaying: !!activePlay,
      currentPlayDuration,
      activePlay: activePlay || null,
      lastPlay: playLogs[0] || null
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all activities for a child (unified timeline)
// @route   GET /api/activities/timeline/:childId
// @access  Private
exports.getActivityTimeline = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { date } = req.query;

    const FoodLog = require('../models/FoodLog');
    const DiaperLog = require('../models/DiaperLog');

    let queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    console.log('Timeline query for child:', childId);
    console.log('Date range:', queryDate, 'to', nextDay);

    const [foodLogs, diaperLogs, sleepLogs, playLogs, cryLogs] = await Promise.all([
      FoodLog.find({
        child: childId,
        timeGiven: { $gte: queryDate, $lt: nextDay }
      }).populate('caretaker', 'name').lean(),
      DiaperLog.find({
        child: childId,
        timeChanged: { $gte: queryDate, $lt: nextDay }
      }).populate('caretaker', 'name').lean(),
      SleepLog.find({
        child: childId,
        startTime: { $gte: queryDate, $lt: nextDay }
      }).populate('caretaker', 'name').lean(),
      PlayLog.find({
        child: childId,
        startTime: { $gte: queryDate, $lt: nextDay }
      }).populate('caretaker', 'name').lean(),
      CryLog.find({
        child: childId,
        startTime: { $gte: queryDate, $lt: nextDay }
      }).populate('caretaker', 'name').lean()
    ]);

    console.log('Found logs:', {
      food: foodLogs.length,
      diaper: diaperLogs.length,
      sleep: sleepLogs.length,
      play: playLogs.length,
      cry: cryLogs.length
    });

    // Combine and format all activities
    const timeline = [
      ...foodLogs.map(log => ({
        _id: log._id,
        type: 'food',
        timestamp: log.timeGiven,
        caretaker: log.caretaker,
        details: {
          foodType: log.foodType,
          quantity: log.quantity,
          unit: log.unit,
          timeGiven: log.timeGiven,
          notes: log.notes
        }
      })),
      ...diaperLogs.map(log => ({
        _id: log._id,
        type: 'diaper',
        timestamp: log.timeChanged,
        caretaker: log.caretaker,
        details: {
          status: log.status,
          timeChanged: log.timeChanged,
          notes: log.notes
        }
      })),
      ...sleepLogs.map(log => ({
        _id: log._id,
        type: 'sleep',
        timestamp: log.startTime,
        caretaker: log.caretaker,
        details: {
          startTime: log.startTime,
          endTime: log.endTime,
          duration: log.duration,
          quality: log.quality,
          isActive: log.isActive,
          notes: log.notes
        }
      })),
      ...playLogs.map(log => ({
        _id: log._id,
        type: 'play',
        timestamp: log.startTime,
        caretaker: log.caretaker,
        details: {
          playType: log.playType,
          activityLevel: log.activityLevel,
          startTime: log.startTime,
          endTime: log.endTime,
          duration: log.duration,
          isActive: log.isActive,
          notes: log.notes
        }
      })),
      ...cryLogs.map(log => ({
        _id: log._id,
        type: 'cry',
        timestamp: log.startTime,
        caretaker: log.caretaker,
        details: {
          startTime: log.startTime,
          endTime: log.endTime,
          duration: log.duration,
          intensity: log.intensity,
          reason: log.reason,
          isActive: log.isActive,
          notes: log.notes
        }
      }))
    ];

    // Sort by timestamp descending
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      count: timeline.length,
      data: timeline
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Delete sleep log
// @route   DELETE /api/activities/sleep/:id
// @access  Private (Caretaker/Admin - can delete own logs or admin can delete any)
exports.deleteSleepLog = async (req, res, next) => {
  try {
    const sleepLog = await SleepLog.findById(req.params.id);

    if (!sleepLog) {
      return res.status(404).json({
        success: false,
        message: 'Sleep log not found'
      });
    }

    // Allow caretaker to delete own log or admin to delete any
    if (sleepLog.caretaker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log'
      });
    }

    await sleepLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sleep log deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete play log
// @route   DELETE /api/activities/play/:id
// @access  Private (Caretaker/Admin - can delete own logs or admin can delete any)
exports.deletePlayLog = async (req, res, next) => {
  try {
    const playLog = await PlayLog.findById(req.params.id);

    if (!playLog) {
      return res.status(404).json({
        success: false,
        message: 'Play log not found'
      });
    }

    // Allow caretaker to delete own log or admin to delete any
    if (playLog.caretaker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log'
      });
    }

    await playLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Play log deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// ========== CRY CONTROLLERS ==========

// @desc    Start cry session
// @route   POST /api/activities/cry/start
// @access  Private (Caretaker, Admin)
exports.startCry = async (req, res, next) => {
  try {
    const { childId, startTime, notes } = req.body;

    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Check if there's an active cry session
    const activeCry = await CryLog.findOne({ child: childId, isActive: true });
    if (activeCry) {
      return res.status(400).json({
        success: false,
        message: 'Child already has an active cry session'
      });
    }

    const cryLog = await CryLog.create({
      child: childId,
      caretaker: req.user.id,
      startTime: startTime || Date.now(),
      notes,
      isActive: true
    });

    const populatedLog = await CryLog.findById(cryLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(201).json({
      success: true,
      message: `😢 Cry session started for ${child.name}`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End cry session
// @route   PUT /api/activities/cry/end/:id
// @access  Private (Caretaker, Admin)
exports.endCry = async (req, res, next) => {
  try {
    const { intensity, reason, endTime, notes } = req.body;

    const cryLog = await CryLog.findById(req.params.id);
    if (!cryLog) {
      return res.status(404).json({
        success: false,
        message: 'Cry log not found'
      });
    }

    const actualEndTime = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((actualEndTime - new Date(cryLog.startTime)) / (1000 * 60)); // minutes

    cryLog.endTime = actualEndTime;
    cryLog.duration = duration;
    cryLog.intensity = intensity || cryLog.intensity;
    cryLog.reason = reason || cryLog.reason;
    cryLog.notes = notes || cryLog.notes;
    cryLog.isActive = false;

    await cryLog.save();

    const populatedLog = await CryLog.findById(cryLog._id)
      .populate('child', 'name childId')
      .populate('caretaker', 'name');

    res.status(200).json({
      success: true,
      message: `😢 Cry session ended. Duration: ${duration} minutes`,
      data: populatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cry logs for a child
// @route   GET /api/activities/cry/child/:childId
// @access  Private
exports.getCryLogsByChild = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { child: childId };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const cryLogs = await CryLog.find(query)
      .populate('child', 'name childId')
      .populate('caretaker', 'name')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: cryLogs.length,
      data: cryLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cry summary for a child
// @route   GET /api/activities/cry/summary/:childId
// @access  Private
exports.getCrySummary = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cryLogs = await CryLog.find({
      child: childId,
      startTime: { $gte: today },
      isActive: false
    }).sort({ startTime: -1 });

    const activeCry = await CryLog.findOne({ child: childId, isActive: true });

    let totalDuration = 0;
    cryLogs.forEach(log => {
      totalDuration += log.duration || 0;
    });

    let currentCryDuration = 0;
    if (activeCry) {
      currentCryDuration = Math.floor((new Date() - new Date(activeCry.startTime)) / (1000 * 60));
    }

    const summary = {
      todayCount: cryLogs.length,
      totalCryToday: totalDuration, // minutes
      averageDuration: cryLogs.length > 0 ? Math.floor(totalDuration / cryLogs.length) : 0,
      isCurrentlyCrying: !!activeCry,
      currentCryDuration,
      activeCry: activeCry || null,
      lastCry: cryLogs[0] || null
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cry log
// @route   DELETE /api/activities/cry/:id
// @access  Private (Caretaker/Admin - can delete own logs or admin can delete any)
exports.deleteCryLog = async (req, res, next) => {
  try {
    const cryLog = await CryLog.findById(req.params.id);

    if (!cryLog) {
      return res.status(404).json({
        success: false,
        message: 'Cry log not found'
      });
    }

    // Allow caretaker to delete own log or admin to delete any
    if (cryLog.caretaker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this log'
      });
    }

    await cryLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Cry log deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};