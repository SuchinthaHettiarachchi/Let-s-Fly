const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const statsCtrl = require('../controllers/statsController');

const router = express.Router();

router.use(requireAuth);
router.get('/', limiter(60), statsCtrl.counts);
router.get('/storage', limiter(30), statsCtrl.storage);

module.exports = router;
