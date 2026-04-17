const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;