const express = require('express');
const packageController = require('../controllers/packageController');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/', packageController.listLatest);
router.get('/manage', requireAuth, packageController.list);
router.get('/:slug', packageController.getBySlug);
router.post('/', requireAuth, limiter(30), packageController.create);
router.put('/:id', requireAuth, limiter(30), packageController.update);
router.delete('/:id', requireAuth, limiter(30), packageController.remove);

module.exports = router;
