const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const categoryCtrl = require('../controllers/categoryController');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));
router.get('/', categoryCtrl.list);
router.post('/', requireAuth, limiter(30), categoryCtrl.create);
router.put('/:id', requireAuth, limiter(30), categoryCtrl.update);
router.delete('/:id', requireAuth, limiter(30), categoryCtrl.remove);

module.exports = router;
