const { httpError } = require('../middleware/error');

const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SCOPES = new Set(['sri-lanka', 'outbound']);

const text = (value, field, max) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw httpError(400, `${field} is required and must be ${max} characters or less`);
  }
  return value.trim();
};

const optionalText = (value, field, max = 1000) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return value.trim();
};

const slugKey = (value) => {
  const key = text(value, 'Key', 60).toLowerCase();
  if (!KEY_RE.test(key)) throw httpError(400, 'Key must be lowercase letters, numbers and hyphens only');
  return key;
};

const parseScope = (value, fallback = 'sri-lanka') => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string' || !SCOPES.has(value)) throw httpError(400, 'Scope must be sri-lanka or outbound');
  return value;
};

exports.validateCategoryCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const sortOrder = Number(body.sortOrder);
  return {
    key: slugKey(body.key),
    label: text(body.label, 'Label', 80),
    scope: parseScope(body.scope, 'sri-lanka'),
    image: optionalText(body.image, 'Image', 1000),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  };
};

exports.validateCategoryUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const result = {};
  if (body.key !== undefined) result.key = slugKey(body.key);
  if (body.label !== undefined) result.label = text(body.label, 'Label', 80);
  if (body.scope !== undefined) result.scope = parseScope(body.scope);
  if (body.image !== undefined) result.image = optionalText(body.image, 'Image', 1000);
  if (body.sortOrder !== undefined) {
    const sortOrder = Number(body.sortOrder);
    if (!Number.isFinite(sortOrder)) throw httpError(400, 'Sort order must be a number');
    result.sortOrder = sortOrder;
  }
  if (Object.keys(result).length === 0) throw httpError(400, 'Nothing to update');
  return result;
};
