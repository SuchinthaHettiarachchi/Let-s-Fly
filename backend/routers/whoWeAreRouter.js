const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const whoWeAreCtrl = require('../controllers/whoWeAreController');

const router = express.Router();

// Content carries long paragraphs, so this route parses its own JSON body
// (the global 10kb parser skips /api/who-we-are, see index.js).
router.use(express.json({ limit: '64kb' }));

router.get('/', whoWeAreCtrl.get);
router.put('/', requireAuth, limiter(20), whoWeAreCtrl.save);

module.exports = router;
