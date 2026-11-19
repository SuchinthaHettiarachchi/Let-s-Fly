const { httpError } = require('../middleware/error');

const toTrimmed = (v, name, max) => {
  if (typeof v !== 'string') throw httpError(400, `${name} must be a string`);
  const s = v.trim();
  if (!s) throw httpError(400, `${name} is required`);
  if (max && s.length > max) throw httpError(400, `${name} is too long`);
  return s;
};

const toOptionalString = (v, max) => {
  if (v == null) return '';
  if (typeof v !== 'string') return '';
  const s = v.trim();
  return max ? s.slice(0, max) : s;
};

const toPrice = (v) => {
  const n = typeof v === 'string' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) {
    throw httpError(400, 'Price per person must be a non-negative number');
  }
  return n;
};

const toSortOrder = (v) => {
  const n = typeof v === 'string' ? Number(v) : v;
  if (v == null || v === '') return 0;
  if (typeof n !== 'number' || !Number.isFinite(n)) return 0;
  return n;
};

exports.validateContent = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'Invalid request body');
  }
  return {
    photo: toOptionalString(body.photo, 500),
    title: toTrimmed(body.title, 'Title', 200),
    description: toTrimmed(body.description, 'Description', 2000),
    phoneNumber: toTrimmed(body.phoneNumber, 'Phone number', 60),
  };
};

exports.validateRoute = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'Invalid request body');
  }
  return {
    startLocation: toTrimmed(body.startLocation, 'Start location', 120),
    endLocation: toTrimmed(body.endLocation, 'End location', 120),
    pricePerPerson: toPrice(body.pricePerPerson),
    image: toOptionalString(body.image, 500),
    sortOrder: toSortOrder(body.sortOrder),
  };
};
