require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const authRouter = require('./routers/authRouter');
const heroRouter = require('./routers/heroRouter');
const { errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
// /api/hero carries base64 WebP images and parses its own 10mb JSON body in the router.
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/hero')) return next();
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

app.use('/api/auth', authRouter);
app.use('/api/hero', heroRouter);
app.use(errorHandler);

mongoose.connect(config.mongoUri)
  .then(() => app.listen(config.port, () => console.log(`Server running on port ${config.port}`)))
  .catch((err) => { console.error('DB connection error:', err.message); process.exit(1); });

module.exports = app;