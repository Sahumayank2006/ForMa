const express = require('express');
const {
  getChildren,
  getChild,
  createChild,
  updateChild,
  deleteChild,
  addActivityLog
} = require('../controllers/childController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getChildren)
  .post(protect, authorize('mother', 'admin'), createChild);

router
  .route('/:id')
  .get(protect, getChild)
  .put(protect, authorize('mother', 'admin'), updateChild)
  .delete(protect, authorize('admin'), deleteChild);

router
  .route('/:id/activity')
  .post(protect, authorize('caretaker', 'admin'), addActivityLog);

module.exports = router;
