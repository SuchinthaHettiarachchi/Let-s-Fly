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
  const result = {
    slug: requiredText(body.slug, 'Slug', 120).toLowerCase(),
    title: requiredText(body.title, 'Title', 160),
    region: requiredText(body.region, 'Region', 100),
    location: optionalText(body.location, 'Location', 160),
    area: optionalText(body.area, 'Area', 160),
    category,
    outboundRegion: optionalText(body.outboundRegion, 'Outbound region', 40),
    themes: category === 'sri-lanka' ? selectedThemes : [],
    featured: body.featured === true,
    badge: optionalText(body.badge, 'Badge', 80),
    days,
    nights,
    price,
    image: optionalText(body.image, 'Image URL', 1000),
    priceNote: optionalText(body.priceNote, 'Price note', 240),
    flightsIncluded: body.flightsIncluded === true,
  };
  if (Object.prototype.hasOwnProperty.call(body, 'rating')) result.rating = body.rating && typeof body.rating === 'object' ? body.rating : undefined;
  if (Object.prototype.hasOwnProperty.call(body, 'gallery')) result.gallery = Array.isArray(body.gallery) ? body.gallery.filter((item) => typeof item === 'string').slice(0, 20) : [];
  if (Object.prototype.hasOwnProperty.call(body, 'brochureUrl')) result.brochureUrl = optionalText(body.brochureUrl, 'Brochure URL', 1000);
  if (Object.prototype.hasOwnProperty.call(body, 'overview')) result.overview = body.overview && typeof body.overview === 'object' ? body.overview : undefined;
  if (Object.prototype.hasOwnProperty.call(body, 'itinerary')) result.itinerary = body.itinerary && typeof body.itinerary === 'object' ? body.itinerary : undefined;
  if (Object.prototype.hasOwnProperty.call(body, 'inclusions')) result.inclusions = body.inclusions && typeof body.inclusions === 'object' ? body.inclusions : undefined;
  if (Object.prototype.hasOwnProperty.call(body, 'related')) result.related = Array.isArray(body.related) ? body.related.filter((item) => typeof item === 'string').slice(0, 20) : [];
  return result;
};
