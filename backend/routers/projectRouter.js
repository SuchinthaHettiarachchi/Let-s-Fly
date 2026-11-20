const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const projectCtrl = require('../controllers/projectController');

const router = express.Router();

router.use(express.json({ limit: '512kb' }));
router.get('/', projectCtrl.listPublic);
router.get('/by-slug/:slug', projectCtrl.getBySlug);
router.get('/manage', requireAuth, limiter(60), projectCtrl.listManage);
router.post('/', requireAuth, limiter(30), projectCtrl.create);
router.put('/:id', requireAuth, limiter(30), projectCtrl.update);
router.delete('/:id', requireAuth, limiter(30), projectCtrl.remove);

module.exports = router;
