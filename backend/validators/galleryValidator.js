const mongoose = require('mongoose');
const { httpError } = require('../middleware/error');

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

const sortOrder = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw httpError(400, 'Sort order must be a number');
  return n;
};

exports.validateCategoryCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  return {
    name: sanitizePlain(body.name, 'Category name', { max: 80 }),
    sortOrder: sortOrder(body.sortOrder),
  };
};

exports.validateCategoryUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const result = {};
  if (body.name !== undefined) result.name = sanitizePlain(body.name, 'Category name', { max: 80 });
  if (body.sortOrder !== undefined) result.sortOrder = sortOrder(body.sortOrder);
  if (!Object.keys(result).length) throw httpError(400, 'Nothing to update');
  return result;
};

const objectId = (value, field) => {
  if (!mongoose.Types.ObjectId.isValid(String(value || ''))) {
    throw httpError(400, `${field} must be a valid category id`);
  }
  return String(value);
};

const mediaUrl = (value) => {
  if (typeof value !== 'string' || !value.trim() || value.length > 1000 || !LINK_RE.test(value.trim())) {
    throw httpError(400, 'Media must be an http(s) URL');
  }
  return value.trim();
};

exports.validateItemCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Gallery item data is required');
  return {
    caption: sanitizePlain(body.caption, 'Caption', { max: 160 }),
    category: objectId(body.category, 'Category'),
    media: mediaUrl(body.media),
    mediaType: body.mediaType === 'video' ? 'video' : 'image',
    sortOrder: sortOrder(body.sortOrder),
  };
};

exports.validateItemUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Gallery item data is required');
  const result = {};
  if (body.caption !== undefined) result.caption = sanitizePlain(body.caption, 'Caption', { max: 160 });
  if (body.category !== undefined) result.category = objectId(body.category, 'Category');
  if (body.media !== undefined) result.media = mediaUrl(body.media);
  if (body.mediaType !== undefined) result.mediaType = body.mediaType === 'video' ? 'video' : 'image';
  if (body.sortOrder !== undefined) result.sortOrder = sortOrder(body.sortOrder);
  if (!Object.keys(result).length) throw httpError(400, 'Nothing to update');
  return result;
};
