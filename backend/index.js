const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const config = require('../config/config');
const authRouter = require('./routers/authRouter');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);

mongoose.connect(config.mongoUri)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err.message);
    process.exit(1);
});

module.exports = app;