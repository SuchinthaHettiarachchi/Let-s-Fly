require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const authRouter = require('./routers/authRouter');
const heroRouter = require('./routers/heroRouter');
const packageRouter = require('./routers/packageRouter');
const uploadRouter = require('./routers/uploadRouter');
const whoWeAreRouter = require('./routers/whoWeAreRouter');
const rentalTeaserRouter = require('./routers/rentalTeaserRouter');
const { errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
// /api/hero, /api/upload and /api/who-we-are parse their own larger JSON bodies in the router.
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/hero') || req.originalUrl.startsWith('/api/upload') || req.originalUrl.startsWith('/api/who-we-are') || req.originalUrl.startsWith('/api/rental-teaser')) return next();
  express.json({ limit: '10kb' })(req, res, next);
});

const clean = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.includes('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key)) delete obj[key];
    else clean(obj[key]);
  }
};
app.use((req, res, next) => { clean(req.body); next(); });

//Add Health Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/hero', heroRouter);
app.use('/api/packages', packageRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/who-we-are', whoWeAreRouter);
app.use('/api/rental-teaser', rentalTeaserRouter);
app.use(errorHandler);

mongoose.connect(config.mongoUri)
  .then(() => app.listen(config.port, () => console.log(`Server running on port ${config.port}`)))
  .catch((err) => { console.error('DB connection error:', err.message); process.exit(1); });

module.exports = app;