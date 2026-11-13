const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const homeAboutCtrl = require('../controllers/homeAboutController');

const router = express.Router();

// Content carries a long paragraph and stat rows, so this route parses its own
// JSON body (the global 10kb parser skips /api/home-about, see index.js).
router.use(express.json({ limit: '64kb' }));

router.get('/', homeAboutCtrl.get);
router.put('/', requireAuth, limiter(20), homeAboutCtrl.save);

module.exports = router;
