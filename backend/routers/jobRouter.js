const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const jobCtrl = require('../controllers/jobController');

const router = express.Router();

router.use(express.json({ limit: '64kb' }));
router.get('/public', jobCtrl.public);
router.use(requireAuth);
router.get('/manage', limiter(60), jobCtrl.listManage);
router.get('/settings', limiter(60), jobCtrl.getSettings);
router.put('/settings', limiter(30), jobCtrl.saveSettings);
router.post('/', limiter(30), jobCtrl.create);
router.put('/:id', limiter(30), jobCtrl.update);
router.delete('/:id', limiter(30), jobCtrl.remove);

module.exports = router;
