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

// Video: raw binary body (fetch sends the File as-is), MP4/WebM up to 100MB.
router.post(
  '/video',
  requireAuth,
  limiter(15),
  express.raw({ type: 'video/*', limit: '100mb' }),
  async (req, res, next) => {
    try {
      const url = await r2Service.uploadRaw(req.body, req.headers['content-type'], 'videos');
      res.status(201).json({ url });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
