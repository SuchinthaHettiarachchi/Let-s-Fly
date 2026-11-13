const { httpError } = require('../middleware/error');

const SLOT_IDS = ['cars', 'vans', 'bikes', 'scooters'];
const LINK_RE = /^(\/(?!\/)|https?:\/\/)/i;

const text = (value, field, max) => {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string' || value.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return value.trim();
};

const image = (value, field) => {
  const result = text(value, field, 1000);
  if (result && !LINK_RE.test(result)) throw httpError(400, `${field} must be a site path (/.) or an http(s) URL`);
  return result;
};

exports.validateRentalTeaser = (body) => {
  if (!body || typeof body !== 'object' || !Array.isArray(body.slots)) {
    throw httpError(400, 'slots must be an array');
  }
  if (body.slots.length !== SLOT_IDS.length) {
    throw httpError(400, `Exactly ${SLOT_IDS.length} slots are required (${SLOT_IDS.join(', ')})`);
  }
  const byId = new Map();
  body.slots.forEach((slot, index) => {
    if (!slot || typeof slot !== 'object') throw httpError(400, `Slot ${index + 1} is invalid`);
    if (!SLOT_IDS.includes(slot.id)) throw httpError(400, `Slot ${index + 1} id must be one of: ${SLOT_IDS.join(', ')}`);
    if (byId.has(slot.id)) throw httpError(400, `Duplicate slot: ${slot.id}`);
    byId.set(slot.id, {
      id: slot.id,
      image: image(slot.image, `Image for ${slot.id}`),
      line1: text(slot.line1, `Line 1 for ${slot.id}`, 60),
      line2: text(slot.line2, `Line 2 for ${slot.id}`, 60),
    });
  });
  // Canonical order: cars, vans, bikes, scooters
  return { slots: SLOT_IDS.map((id) => byId.get(id)) };
};
