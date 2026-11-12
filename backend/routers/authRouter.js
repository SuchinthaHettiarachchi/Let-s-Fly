const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const authCtrl = require('../controllers/authController');

const router = express.Router();

router.post('/register', limiter(15), authCtrl.register);
router.post('/login', limiter(15), authCtrl.login);
router.post('/logout', authCtrl.logout);
router.post('/forgot-password', limiter(10), authCtrl.forgotPassword);

module.exports = router;