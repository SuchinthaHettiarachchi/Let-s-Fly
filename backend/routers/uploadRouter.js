const express = require('express');
const { limiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const r2Service = require('../services/r2Service');

const router = express.Router();

// Legacy base64 JSON upload (kept for compatibility).
router.post('/', requireAuth, limiter(30), express.json({ limit: '7mb' }), async (req, res, next) => {
  try {
    const { image, folder } = req.body || {};
    const url = await r2Service.uploadDataUrl(image, typeof folder === 'string' ? folder : 'packages');
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

// Presigned direct-to-R2 upload (browser PUTs to R2, avoiding backend hop).
router.post('/presign', requireAuth, limiter(60), express.json({ limit: '10kb' }), async (req, res, next) => {
  try {
    const { contentType, folder, fileSize, size, contentLength } = req.body || {};
    const data = await r2Service.presignPut(
      contentType,
      typeof folder === 'string' ? folder : 'uploads',
      fileSize ?? size ?? contentLength ?? 0,
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Raw binary upload (image or video) - proxied fallback with progress support.
router.post(
  '/binary',
  requireAuth,
  limiter(30),
  express.raw({ type: () => true, limit: '100mb' }),
  async (req, res, next) => {
    try {
      const folder =
        (typeof req.query.folder === 'string' && req.query.folder) ||
        (typeof req.headers['x-upload-folder'] === 'string' && req.headers['x-upload-folder']) ||
        'uploads';
      const url = await r2Service.uploadRaw(req.body, req.headers['content-type'], folder);
      res.status(201).json({ url });
    } catch (error) {
      next(error);
    }
  },
);

// Video: raw binary body (legacy path).
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
