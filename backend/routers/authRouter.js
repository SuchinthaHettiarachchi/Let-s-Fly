const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const authCtrl = require('../controllers/authController');

const router = express.Router();

router.post('/register', limiter(5), authCtrl.register);
router.post('/login', limiter(5), authCtrl.login);
router.post('/logout', authCtrl.logout);
router.post('/forgot-password', limiter(3), authCtrl.forgotPassword);

module.exports = router;