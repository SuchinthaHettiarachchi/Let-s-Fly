const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const heroCtrl = require('../controllers/heroController');

const router = express.Router();

// Hero slots carry base64 WebP images, so this route parses its own JSON body
// with a larger cap; the global 10kb parser skips /api/hero (see index.js).
router.use(express.json({ limit: '10mb' }));
router.get('/', heroCtrl.get);
router.put('/', requireAuth, limiter(20), heroCtrl.save);

module.exports = router;
