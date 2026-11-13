const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const heroCtrl = require('../controllers/heroController');

const router = express.Router();

// Kept larger than the global 10kb parser while legacy base64 slides are
// still accepted; R2 URL saves are tiny. The global parser skips /api/hero.
router.use(express.json({ limit: '10mb' }));
router.get('/', heroCtrl.get);
router.put('/', requireAuth, limiter(20), heroCtrl.save);

module.exports = router;
