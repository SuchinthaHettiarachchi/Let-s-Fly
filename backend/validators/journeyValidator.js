const { httpError } = require('../middleware/error');

const sanitizePlain = (value, field, { min = 1, max = 200 } = {}) => {
  if (typeof value !== 'string') throw httpError(400, `${field} is required`);
  const cleaned = value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length < min) throw httpError(400, `${field} is required`);
  if (cleaned.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return cleaned;
};

const sortOrder = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw httpError(400, 'Sort order must be a number');
  return n;
};

exports.validateJourneyCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Journey data is required');
  return {
    kind: body.kind,
    name: sanitizePlain(body.name, 'Name', { max: 120 }),
    label: sanitizePlain(body.label, 'Label', { max: 80 }),
    text: sanitizePlain(body.text, 'Description', { max: 2000 }),
    price: Number(body.price),
    priceNote: sanitizePlain(body.priceNote, 'Price note', { max: 200 }),
    image: body.image.trim(),
    chips: Array.isArray(body.chips) ? body.chips.map(c => String(c).trim()).filter(Boolean) : [],
    // Train-specific: country is optional, defaults to null (cruise)
    country: body.country || undefined,
    startingPoint: sanitizePlain(body.startingPoint ?? '', 'Starting point', { max: 120 }),
    stops: Array.isArray(body.stops) ? body.stops.map(s => String(s).trim()).filter(Boolean) : [],
  };
};

exports.validateJourneyUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Journey data is required');
  const result = {};
  if (body.kind !== undefined) result.kind = String(body.kind);
  if (body.name !== undefined) result.name = sanitizePlain(body.name, 'Name', { max: 120 });
  if (body.label !== undefined) result.label = sanitizePlain(body.label, 'Label', { max: 80 });
  if (body.text !== undefined) result.text = sanitizePlain(body.text, 'Description', { max: 2000 });
  if (body.price !== undefined) result.price = Number(body.price);
  if (body.priceNote !== undefined) result.priceNote = sanitizePlain(body.priceNote, 'Price note', { max: 200 });
  if (body.image !== undefined) result.image = String(body.image).trim();
  if (body.chips !== undefined) result.chips = Array.isArray(body.chips) ? body.chips.map(c => String(c).trim()).filter(Boolean) : [];
  if (body.country !== undefined) result.country = String(body.country) || undefined;
  if (body.startingPoint !== undefined) result.startingPoint = sanitizePlain(body.startingPoint ?? '', 'Starting point', { max: 120 });
  if (body.stops !== undefined) result.stops = Array.isArray(body.stops) ? body.stops.map(s => String(s).trim()).filter(Boolean) : [];
  if (!Object.keys(result).length) throw httpError(400, 'Nothing to update');
  return result;
};