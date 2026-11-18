const { httpError } = require('../middleware/error');

const sanitizePlain = (value, field, { min = 1, max = 200 } = {}) => {
  if (typeof value !== 'string') throw httpError(400, `${field} is required`);
  const cleaned = value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length < min) {
    throw httpError(400, min === 1 ? `${field} is required` : `${field} is too short`);
  }
  if (cleaned.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return cleaned;
};

const sanitizeOptional = (value, field, { max = 200 } = {}) => {
  if (value === undefined || value === null || value === '') return '';
  return sanitizePlain(String(value), field, { min: 0, max });
};

exports.validateJourneyCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Journey data is required');
  const kind = body.kind === 'train' || body.kind === 'cruise' ? body.kind : null;
  if (!kind) throw httpError(400, 'Journey kind is required');
  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) throw httpError(400, 'Price must be greater than 0');
  const image = typeof body.image === 'string' ? body.image.trim() : '';
  if (!image) throw httpError(400, 'Image is required');

  return {
    kind,
    name: sanitizePlain(String(body.name ?? ''), 'Name', { max: 120 }),
    label: sanitizePlain(String(body.label ?? ''), 'Label', { max: 80 }),
    text: sanitizePlain(String(body.text ?? ''), 'Description', { max: 2000 }),
    price,
    priceNote: sanitizePlain(String(body.priceNote ?? ''), 'Price note', { max: 200 }),
    image,
    chips: Array.isArray(body.chips) ? body.chips.map((c) => String(c).trim()).filter(Boolean).slice(0, 20) : [],
    country: body.country === 'Sri Lankan' || body.country === 'Overseas' ? body.country : undefined,
    startingPoint: sanitizeOptional(body.startingPoint, 'Starting point', { max: 120 }),
    stops: Array.isArray(body.stops) ? body.stops.map((s) => String(s).trim()).filter(Boolean).slice(0, 10) : [],
  };
};

exports.validateJourneyUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Journey data is required');
  const result = {};
  if (body.kind !== undefined) {
    if (body.kind !== 'train' && body.kind !== 'cruise') throw httpError(400, 'Invalid journey kind');
    result.kind = body.kind;
  }
  if (body.name !== undefined) result.name = sanitizePlain(String(body.name), 'Name', { max: 120 });
  if (body.label !== undefined) result.label = sanitizePlain(String(body.label), 'Label', { max: 80 });
  if (body.text !== undefined) result.text = sanitizePlain(String(body.text), 'Description', { max: 2000 });
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) throw httpError(400, 'Price must be greater than 0');
    result.price = price;
  }
  if (body.priceNote !== undefined) result.priceNote = sanitizePlain(String(body.priceNote), 'Price note', { max: 200 });
  if (body.image !== undefined) {
    const image = typeof body.image === 'string' ? body.image.trim() : '';
    if (!image) throw httpError(400, 'Image is required');
    result.image = image;
  }
  if (body.chips !== undefined) {
    result.chips = Array.isArray(body.chips) ? body.chips.map((c) => String(c).trim()).filter(Boolean).slice(0, 20) : [];
  }
  if (body.country !== undefined) {
    result.country = body.country === 'Sri Lankan' || body.country === 'Overseas' ? body.country : null;
  }
  if (body.startingPoint !== undefined) result.startingPoint = sanitizeOptional(body.startingPoint, 'Starting point', { max: 120 });
  if (body.stops !== undefined) {
    result.stops = Array.isArray(body.stops) ? body.stops.map((s) => String(s).trim()).filter(Boolean).slice(0, 10) : [];
  }
  if (!Object.keys(result).length) throw httpError(400, 'Nothing to update');
  return result;
};