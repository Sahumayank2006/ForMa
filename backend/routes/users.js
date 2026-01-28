const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCaretakers,
  getMothers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/caretakers', getCaretakers);
router.get('/mothers', getMothers);

router
  .route('/')
  .get(getUsers);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
