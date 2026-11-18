const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { limiter } = require('../middleware/rateLimiter');
const journeyService = require('../services/journeyService');
const { validateJourneyCreate, validateJourneyUpdate } = require('../validators/journeyValidator');

const router = express.Router();

router.use(express.json({ limit: '32kb' }));

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.kind ? { kind: String(req.query.kind) } : {};
    const journeys = await journeyService.list(filter);
    res.json({ journeys });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, limiter(30), async (req, res, next) => {
  try {
    const data = validateJourneyCreate(req.body);
    const journey = await journeyService.create(data);
    res.status(201).json({ journey });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, limiter(30), async (req, res, next) => {
  try {
    const data = validateJourneyUpdate(req.body);
    const journey = await journeyService.update(req.params.id, data);
    if (!journey) return res.status(404).json({ message: 'Journey not found' });
    return res.json({ journey });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, limiter(30), async (req, res, next) => {
  try {
    const removed = await journeyService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Journey not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;