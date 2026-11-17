const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const galleryCategoryCtrl = require('../controllers/galleryCategoryController');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));
router.get('/', galleryCategoryCtrl.list);
router.post('/', requireAuth, limiter(30), galleryCategoryCtrl.create);
router.put('/:id', requireAuth, limiter(30), galleryCategoryCtrl.update);
router.delete('/:id', requireAuth, limiter(30), galleryCategoryCtrl.remove);

module.exports = router;
