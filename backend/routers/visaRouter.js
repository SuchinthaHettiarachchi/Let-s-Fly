const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/visaController');

const router = express.Router();

router.get('/public', ctrl.getPublic);
router.get('/by-slug/:slug', ctrl.getVisaBySlug);

router.use(requireAuth);
router.use(express.json({ limit: '512kb' }));

router.get('/manage', ctrl.listVisas);
router.post('/manage', limiter(30), ctrl.createVisa);
router.put('/manage/:id', limiter(30), ctrl.updateVisa);
router.delete('/manage/:id', limiter(30), ctrl.deleteVisa);

router.get('/categories', ctrl.listCategories);
router.post('/categories', limiter(30), ctrl.createCategory);
router.put('/categories/:id', limiter(30), ctrl.updateCategory);
router.delete('/categories/:id', limiter(30), ctrl.deleteCategory);

router.get('/countries', ctrl.listCountries);
router.post('/countries', limiter(30), ctrl.createCountry);
router.put('/countries/:id', limiter(30), ctrl.updateCountry);
router.delete('/countries/:id', limiter(30), ctrl.deleteCountry);

router.get('/page', ctrl.getPage);
router.put('/page', limiter(30), ctrl.savePage);

module.exports = router;
