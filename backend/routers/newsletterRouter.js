const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const newsletterCtrl = require('../controllers/newsletterController');

const router = express.Router();

router.use(express.json({ limit: '16kb' }));
router.post('/', limiter(30), newsletterCtrl.subscribe);
router.use(requireAuth);
router.get('/manage', limiter(60), newsletterCtrl.list);
router.delete('/:id', limiter(30), newsletterCtrl.remove);

module.exports = router;
