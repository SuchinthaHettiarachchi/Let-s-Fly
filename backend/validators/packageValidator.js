const { httpError } = require('../middleware/error');

const categories = new Set(['outbound', 'sri-lanka']);
const themes = new Set(['cultural', 'hill-country', 'beaches', 'wildlife']);

const requiredText = (value, field, max = 200) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw httpError(400, `${field} is required and must be ${max} characters or less`);
  }
  return value.trim();
};

const optionalText = (value, field, max = 200) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return value.trim();
};

exports.validatePackage = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Package data is required');
  const category = requiredText(body.category, 'Category', 20);
  if (!categories.has(category)) throw httpError(400, 'Category must be outbound or sri-lanka');
  const selectedThemes = Array.isArray(body.themes) ? body.themes.filter((theme) => themes.has(theme)) : [];
  const days = Number(body.days);
  const nights = Number(body.nights);
  const price = Number(body.price);
  if (!Number.isInteger(days) || days < 1) throw httpError(400, 'Days must be a positive whole number');
  if (!Number.isInteger(nights) || nights < 0) throw httpError(400, 'Nights must be a non-negative whole number');
  if (!Number.isFinite(price) || price < 0) throw httpError(400, 'Price must be a non-negative number');
  return {
    slug: requiredText(body.slug, 'Slug', 120).toLowerCase(),
    title: requiredText(body.title, 'Title', 160),
    region: requiredText(body.region, 'Region', 100),
    area: optionalText(body.area, 'Area', 160),
    category,
    themes: category === 'sri-lanka' ? selectedThemes : [],
    badge: optionalText(body.badge, 'Badge', 80),
    days,
    nights,
    price,
    image: optionalText(body.image, 'Image URL', 1000),
    flightsIncluded: body.flightsIncluded === true,
  };
};
