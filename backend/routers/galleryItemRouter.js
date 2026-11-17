const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const galleryItemCtrl = require('../controllers/galleryItemController');

const router = express.Router();

router.use(express.json({ limit: '64kb' }));
router.get('/', galleryItemCtrl.list);
router.post('/', requireAuth, limiter(30), galleryItemCtrl.create);
router.post('/reorder', requireAuth, limiter(60), galleryItemCtrl.reorder);
router.put('/:id', requireAuth, limiter(30), galleryItemCtrl.update);
router.delete('/:id', requireAuth, limiter(30), galleryItemCtrl.remove);

module.exports = router;
