const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const authCtrl = require('../controllers/authController');

const router = express.Router();

router.post('/login', limiter(15), authCtrl.login);
router.post('/logout', authCtrl.logout);

module.exports = router;
