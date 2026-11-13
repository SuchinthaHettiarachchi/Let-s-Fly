const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const rentalTeaserCtrl = require('../controllers/rentalTeaserController');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));
router.get('/', rentalTeaserCtrl.get);
router.put('/', requireAuth, limiter(20), rentalTeaserCtrl.save);

module.exports = router;
