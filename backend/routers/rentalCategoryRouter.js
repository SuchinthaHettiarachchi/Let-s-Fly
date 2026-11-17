const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const rentalCategoryCtrl = require('../controllers/rentalCategoryController');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));
router.get('/', rentalCategoryCtrl.list);
router.post('/', requireAuth, limiter(30), rentalCategoryCtrl.create);
router.put('/:id', requireAuth, limiter(30), rentalCategoryCtrl.update);
router.delete('/:id', requireAuth, limiter(30), rentalCategoryCtrl.remove);

module.exports = router;
