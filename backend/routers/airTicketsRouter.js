const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/airTicketsController');

const router = express.Router();

// Public: hero content + popular routes for the visitor page
router.get('/', ctrl.getPublic);

// Admin (CMS)
router.use(requireAuth);
router.use(express.json({ limit: '256kb' }));

router.get('/content', ctrl.getContent);
router.put('/content', limiter(30), ctrl.saveContent);

router.get('/routes', ctrl.listRoutes);
router.post('/routes', limiter(30), ctrl.createRoute);
router.put('/routes/:id', limiter(30), ctrl.updateRoute);
router.delete('/routes/:id', limiter(30), ctrl.deleteRoute);

module.exports = router;
