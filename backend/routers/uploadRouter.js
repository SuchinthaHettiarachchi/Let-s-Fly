const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const r2Service = require('../services/r2Service');

const router = express.Router();

// Uploads carry base64 images, so this route parses its own JSON body with a
// larger cap; the global 10kb parser skips /api/upload (see index.js).
router.use(express.json({ limit: '7mb' }));

router.post('/', requireAuth, limiter(30), async (req, res, next) => {
  try {
    const { image, folder } = req.body || {};
    const url = await r2Service.uploadDataUrl(image, typeof folder === 'string' ? folder : 'packages');
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
