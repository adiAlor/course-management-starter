const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  getDashboard,
  registerValidation,
  loginValidation
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);
router.get('/dashboard', auth, getDashboard);

module.exports = router;