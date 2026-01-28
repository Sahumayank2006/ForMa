const express = require('express');
const {
  addFoodLog,
  getFoodLogsByChild,
  getAllFoodLogs,
  getFoodSummary,
  deleteFoodLog
} = require('../controllers/foodController');

const {
  addDiaperLog,
  getDiaperLogsByChild,
  getAllDiaperLogs,
  getDiaperSummary,
  checkOverdueDiapers,
  deleteDiaperLog
} = require('../controllers/diaperController');

const {
  startSleep,
  endSleep,
  getSleepLogsByChild,
  getSleepSummary,
  startPlay,
  endPlay,
  getPlayLogsByChild,
  getPlaySummary,
  getActivityTimeline,
  deleteSleepLog,
  deletePlayLog
} = require('../controllers/activityController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Food routes
router.post('/food', protect, authorize('caretaker', 'admin'), addFoodLog);
router.get('/food/child/:childId', protect, getFoodLogsByChild);
router.get('/food/all', protect, authorize('admin'), getAllFoodLogs);
router.get('/food/summary/:childId', protect, getFoodSummary);
router.delete('/food/:id', protect, authorize('caretaker', 'admin'), deleteFoodLog);

// Diaper routes
router.post('/diaper', protect, authorize('caretaker', 'admin'), addDiaperLog);
router.get('/diaper/child/:childId', protect, getDiaperLogsByChild);
router.get('/diaper/all', protect, authorize('admin'), getAllDiaperLogs);
router.get('/diaper/summary/:childId', protect, getDiaperSummary);
router.get('/diaper/check-overdue', protect, authorize('admin'), checkOverdueDiapers);
router.delete('/diaper/:id', protect, authorize('caretaker', 'admin'), deleteDiaperLog);

// Sleep routes
router.post('/sleep/start', protect, authorize('caretaker', 'admin'), startSleep);
router.put('/sleep/end/:id', protect, authorize('caretaker', 'admin'), endSleep);
router.get('/sleep/child/:childId', protect, getSleepLogsByChild);
router.get('/sleep/summary/:childId', protect, getSleepSummary);
router.delete('/sleep/:id', protect, authorize('caretaker', 'admin'), deleteSleepLog);

// Play routes
router.post('/play/start', protect, authorize('caretaker', 'admin'), startPlay);
router.put('/play/end/:id', protect, authorize('caretaker', 'admin'), endPlay);
router.get('/play/child/:childId', protect, getPlayLogsByChild);
router.get('/play/summary/:childId', protect, getPlaySummary);
router.delete('/play/:id', protect, authorize('caretaker', 'admin'), deletePlayLog);

// Unified timeline
router.get('/timeline/:childId', protect, getActivityTimeline);

module.exports = router;
