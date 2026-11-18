const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const hotelBookingCtrl = require('../controllers/hotelBookingController');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));
router.get('/', hotelBookingCtrl.get);
router.put('/', requireAuth, limiter(20), hotelBookingCtrl.save);

module.exports = router;
