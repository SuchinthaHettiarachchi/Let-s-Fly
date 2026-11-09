const express = require('express');
const rateLimit = require('express-rate-limit');
const authCtrl = require('../controllers/authController');

const limiter = (limit) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, try again later' },
});

const router = express.Router();

router.post('/register', limiter(5), authCtrl.register);
router.post('/login', limiter(5), authCtrl.login);
router.post('/forgot-password', limiter(3), authCtrl.forgotPassword);

module.exports = router;