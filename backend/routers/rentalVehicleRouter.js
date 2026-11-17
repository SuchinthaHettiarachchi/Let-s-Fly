const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const rentalVehicleCtrl = require('../controllers/rentalVehicleController');

const router = express.Router();

router.use(express.json({ limit: '64kb' }));
router.get('/', rentalVehicleCtrl.list);
router.get('/manage', requireAuth, rentalVehicleCtrl.list);
router.post('/', requireAuth, limiter(30), rentalVehicleCtrl.create);
router.put('/:id', requireAuth, limiter(30), rentalVehicleCtrl.update);
router.delete('/:id', requireAuth, limiter(30), rentalVehicleCtrl.remove);

module.exports = router;
