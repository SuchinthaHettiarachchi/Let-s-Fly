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
const homeAboutRouter = require('./routers/homeAboutRouter');
const rentalTeaserRouter = require('./routers/rentalTeaserRouter');
const categoryRouter = require('./routers/categoryRouter');
const rentalCategoryRouter = require('./routers/rentalCategoryRouter');
const rentalVehicleRouter = require('./routers/rentalVehicleRouter');
const galleryCategoryRouter = require('./routers/galleryCategoryRouter');
const galleryItemRouter = require('./routers/galleryItemRouter');
const journeyRouter = require('./routers/journeyRouter');
const hotelBookingRouter = require('./routers/hotelBookingRouter');
const airTicketsRouter = require('./routers/airTicketsRouter');
const visaRouter = require('./routers/visaRouter');
const projectRouter = require('./routers/projectRouter');
const jobRouter = require('./routers/jobRouter');
const newsletterRouter = require('./routers/newsletterRouter');
const inquiryRouter = require('./routers/inquiryRouter');
const { errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
// These routers parse their own larger JSON bodies in the router.
app.use((req, res, next) => {
  if (
    req.originalUrl.startsWith('/api/hero')
    || req.originalUrl.startsWith('/api/upload')
    || req.originalUrl.startsWith('/api/who-we-are')
    || req.originalUrl.startsWith('/api/home-about')
    || req.originalUrl.startsWith('/api/rental-teaser')
    || req.originalUrl.startsWith('/api/packages')
    || req.originalUrl.startsWith('/api/categories')
    || req.originalUrl.startsWith('/api/rental-categories')
    || req.originalUrl.startsWith('/api/rental-vehicles')
    || req.originalUrl.startsWith('/api/gallery-categories')
    || req.originalUrl.startsWith('/api/gallery-items')
    || req.originalUrl.startsWith('/api/journey-categories')
    || req.originalUrl.startsWith('/api/journey-items')
    || req.originalUrl.startsWith('/api/hotel-booking')
    || req.originalUrl.startsWith('/api/air-tickets')
    || req.originalUrl.startsWith('/api/visas')
    || req.originalUrl.startsWith('/api/projects')
    || req.originalUrl.startsWith('/api/jobs')
    || req.originalUrl.startsWith('/api/newsletter')
    || req.originalUrl.startsWith('/api/inquiries')
  ) return next();
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
app.use('/api/home-about', homeAboutRouter);
app.use('/api/rental-teaser', rentalTeaserRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/rental-categories', rentalCategoryRouter);
app.use('/api/rental-vehicles', rentalVehicleRouter);
app.use('/api/gallery-categories', galleryCategoryRouter);
app.use('/api/gallery-items', galleryItemRouter);
app.use('/api/journey-categories', journeyRouter);
app.use('/api/hotel-booking', hotelBookingRouter);
app.use('/api/air-tickets', airTicketsRouter);
app.use('/api/visas', visaRouter);
app.use('/api/projects', projectRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/inquiries', inquiryRouter);
app.use(errorHandler);

mongoose.connect(config.mongoUri)
  .then(() => app.listen(config.port, () => console.log(`Server running on port ${config.port}`)))
  .catch((err) => { console.error('DB connection error:', err.message); process.exit(1); });

module.exports = app;
