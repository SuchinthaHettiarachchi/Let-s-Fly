const { httpError } = require('../middleware/error');

const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const text = (value, field, max) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw httpError(400, `${field} is required and must be ${max} characters or less`);
  }
  return value.trim();
};

const slugKey = (value) => {
  const key = text(value, 'Key', 60).toLowerCase();
  if (!KEY_RE.test(key)) throw httpError(400, 'Key must be lowercase letters, numbers and hyphens only');
  return key;
};

exports.validateCategoryCreate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const sortOrder = Number(body.sortOrder);
  return {
    key: slugKey(body.key),
    label: text(body.label, 'Label', 80),
    scope: 'sri-lanka',
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  };
};

exports.validateCategoryUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Category data is required');
  const result = {};
  if (body.key !== undefined) result.key = slugKey(body.key);
  if (body.label !== undefined) result.label = text(body.label, 'Label', 80);
  if (body.sortOrder !== undefined) {
    const sortOrder = Number(body.sortOrder);
    if (!Number.isFinite(sortOrder)) throw httpError(400, 'Sort order must be a number');
    result.sortOrder = sortOrder;
  }
  if (Object.keys(result).length === 0) throw httpError(400, 'Nothing to update');
  return result;
};
