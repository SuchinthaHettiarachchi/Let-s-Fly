const { httpError } = require('../middleware/error');

const categories = new Set(['outbound', 'sri-lanka']);

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

const textList = (value, field, maxItems = 50, maxLen = 200) => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw httpError(400, `${field} must be an array`);
  return value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim().slice(0, maxLen)).slice(0, maxItems);
};

const cleanHighlight = (item) => {
  if (!item || typeof item !== 'object') return null;
  const label = optionalText(item.label, 'Highlight label', 160);
  if (!label) return null;
  return { icon: optionalText(item.icon, 'Highlight icon', 60) || 'check_circle', label };
};

const cleanInclusion = (item) => {
  if (!item || typeof item !== 'object') return null;
  const title = optionalText(item.title, 'List item title', 200);
  if (!title) return null;
  const note = optionalText(item.note, 'List item note', 300);
  return note ? { title, note } : { title };
};

const cleanOverview = (value) => {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') return undefined;
  const summary = optionalText(value.summary, 'Overview summary', 4000);
  const highlights = Array.isArray(value.highlights) ? value.highlights.map(cleanHighlight).filter(Boolean).slice(0, 30) : [];
  return { summary, highlights };
};

const cleanItinerary = (value) => {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') return undefined;
  const days = Array.isArray(value.days)
    ? value.days.map((day) => {
      if (!day || typeof day !== 'object') return null;
      const title = optionalText(day.title, 'Itinerary day title', 200);
      if (!title) return null;
      const body = optionalText(day.body, 'Itinerary day body', 4000);
      return {
        category: optionalText(day.category, 'Itinerary day eyebrow', 80),
        title,
        meta: Array.isArray(day.meta) ? day.meta.filter((m) => m && typeof m === 'object' && typeof m.label === 'string').slice(0, 8) : [],
        body,
      };
    }).filter(Boolean).slice(0, 60) : [];
  return {
    endpoints: optionalText(value.endpoints, 'Itinerary endpoints', 200),
    route: textList(value.route, 'Itinerary route', 30, 120),
    footnote: optionalText(value.footnote, 'Itinerary footnote', 800),
    days,
  };
};

const cleanInclusions = (value) => {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') return undefined;
  return {
    intro: optionalText(value.intro, 'Inclusions intro', 2000),
    included: Array.isArray(value.included) ? value.included.map(cleanInclusion).filter(Boolean).slice(0, 50) : [],
    excluded: Array.isArray(value.excluded) ? value.excluded.map(cleanInclusion).filter(Boolean).slice(0, 50) : [],
  };
};

const cleanPayment = (value) => {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') return undefined;
  const methods = Array.isArray(value.methods)
    ? value.methods.map((m) => {
      if (!m || typeof m !== 'object') return null;
      const title = optionalText(m.title, 'Payment method title', 120);
      if (!title) return null;
      return {
        icon: optionalText(m.icon, 'Payment method icon', 60) || 'payments',
        title,
        text: optionalText(m.text, 'Payment method text', 400),
      };
    }).filter(Boolean).slice(0, 12) : [];
  const steps = Array.isArray(value.steps)
    ? value.steps.map((s) => {
      if (!s || typeof s !== 'object') return null;
      const title = optionalText(s.title, 'Payment step title', 160);
      if (!title) return null;
      return { title, text: optionalText(s.text, 'Payment step text', 400) };
    }).filter(Boolean).slice(0, 12) : [];
  return {
    methods,
    steps,
    note: optionalText(value.note, 'Payment note', 1000),
  };
};

exports.validatePackage = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Package data is required');
  const category = requiredText(body.category, 'Category', 20);
  if (!categories.has(category)) throw httpError(400, 'Category must be outbound or sri-lanka');
  // Dynamic categories: keep any slug-like keys (validated against Category collection in service if needed).
  const selectedThemes = Array.isArray(body.themes)
    ? body.themes.filter((theme) => typeof theme === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(theme)).slice(0, 20)
    : [];
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
  if (Object.prototype.hasOwnProperty.call(body, 'overview')) result.overview = cleanOverview(body.overview);
  if (Object.prototype.hasOwnProperty.call(body, 'itinerary')) result.itinerary = cleanItinerary(body.itinerary);
  if (Object.prototype.hasOwnProperty.call(body, 'inclusions')) result.inclusions = cleanInclusions(body.inclusions);
  if (Object.prototype.hasOwnProperty.call(body, 'payment')) result.payment = cleanPayment(body.payment);
  if (Object.prototype.hasOwnProperty.call(body, 'related')) result.related = Array.isArray(body.related) ? body.related.filter((item) => typeof item === 'string').slice(0, 20) : [];
  return result;
};
