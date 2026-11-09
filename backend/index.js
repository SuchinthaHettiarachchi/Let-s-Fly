require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const authRouter = require('./routers/authRouter');
const { errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json({ limit: '10kb' }));

const clean = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.includes('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key)) delete obj[key];
    else clean(obj[key]);
  }
};
app.use((req, res, next) => { clean(req.body); next(); });

app.use('/api/auth', authRouter);
app.use(errorHandler);

mongoose.connect(config.mongoUri)
  .then(() => app.listen(config.port, () => console.log(`Server running on port ${config.port}`)))
  .catch((err) => { console.error('DB connection error:', err.message); process.exit(1); });

module.exports = app;