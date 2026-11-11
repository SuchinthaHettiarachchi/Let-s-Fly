const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  active: { type: Boolean, default: true },
  desktop: { type: String, default: '' },
  mobile: { type: String, default: '' },
}, { _id: false });

const heroSliderSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'home' },
  slides: { type: [slideSchema], default: [] },
});

module.exports = mongoose.model('HeroSlider', heroSliderSchema);
