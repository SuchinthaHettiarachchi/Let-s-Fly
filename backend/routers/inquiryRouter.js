const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const inquiryCtrl = require('../controllers/inquiryController');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));
router.post('/', limiter(30), inquiryCtrl.submit);
router.use(requireAuth);
router.get('/manage', limiter(60), inquiryCtrl.list);
router.put('/:id', limiter(30), inquiryCtrl.update);
router.delete('/:id', limiter(30), inquiryCtrl.remove);

module.exports = router;
