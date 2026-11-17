const { httpError } = require('../middleware/error');
const mongoose = require('mongoose');

const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUELS = ['Hybrid', 'Diesel', 'Petrol'];
const MODES = ['self-drive', 'with-driver'];
const ICON_RE = /^[a-z0-9_]+$/;
const LINK_RE = /^(\/(?!\/)|https?:\/\/)/i;

// Strips HTML tags and control characters, collapses whitespace — keeps plain text only.
const sanitizePlain = (value, field, { min = 1, max = 120 } = {}) => {
  if (typeof value !== 'string') throw httpError(400, `${field} is required`);
  const cleaned = value
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length < min) throw httpError(400, `${field} is required`);
  if (cleaned.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return cleaned;
};

const objectId = (value, field) => {
  if (!mongoose.Types.ObjectId.isValid(String(value || ''))) {
    throw httpError(400, `${field} must be a valid category id`);
  }
  return String(value);
};

const image = (value, field) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > 1000 || !LINK_RE.test(value)) {
    throw httpError(400, `${field} must be a site path (/. ) or an http(s) URL`);
  }
  return value.trim();
};

// Seats: positive whole number only. Empty/0/decimal/negative are rejected so the
// client can clear the input freely but never submit an invalid value.
const seats = (value) => {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (!Number.isInteger(n) || n < 1) {
    throw httpError(400, 'Seats must be a positive whole number');
  }
  return n;
};

const enumValue = (value, allowed, field) => {
  if (!allowed.includes(value)) throw httpError(400, `${field} must be one of: ${allowed.join(', ')}`);
  return value;
};

const modes = (value) => {
  if (!Array.isArray(value)) throw httpError(400, 'Modes must be an array');
  const cleaned = [...new Set(value.filter((m) => MODES.includes(m)))];
  if (!cleaned.length) throw httpError(400, 'Select at least one drive mode');
  return cleaned;
};

const sortOrder = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw httpError(400, 'Sort order must be a number');
  return n;
};

exports.validateCategoryCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const icon = typeof body.icon === 'string' ? body.icon.trim() : '';
  if (!ICON_RE.test(icon)) throw httpError(400, 'Icon must be a vehicle icon name (letters, numbers, underscores)');
  return {
    name: sanitizePlain(body.name, 'Category name', { max: 80 }),
    icon,
    sortOrder: sortOrder(body.sortOrder),
  };
};

exports.validateCategoryUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const result = {};
  if (body.name !== undefined) result.name = sanitizePlain(body.name, 'Category name', { max: 80 });
  if (body.icon !== undefined) {
    const icon = String(body.icon).trim();
    if (!ICON_RE.test(icon)) throw httpError(400, 'Icon must be a vehicle icon name (letters, numbers, underscores)');
    result.icon = icon;
  }
  if (body.sortOrder !== undefined) result.sortOrder = sortOrder(body.sortOrder);
  if (!Object.keys(result).length) throw httpError(400, 'Nothing to update');
  return result;
};

// Full validation used for both create and update — the admin form always sends
// the complete vehicle draft.
exports.validateVehicle = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Vehicle data is required');
  return {
    name: sanitizePlain(body.name, 'Vehicle title', { max: 120 }),
    category: objectId(body.category, 'Category'),
    seats: seats(body.seats),
    transmission: enumValue(body.transmission, TRANSMISSIONS, 'Transmission'),
    fuel: enumValue(body.fuel, FUELS, 'Fuel type'),
    modes: modes(body.modes),
    image: image(body.image, 'Image'),
    sortOrder: sortOrder(body.sortOrder),
  };
};
