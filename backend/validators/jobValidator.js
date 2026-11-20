const { httpError } = require('../middleware/error');

const STATUSES = new Set(['Hiring', 'Soon', 'Open']);

const text = (value, field, { required = false, max = 500 } = {}) => {
  if (typeof value !== 'string') {
    if (required) throw httpError(400, `${field} is required`);
    return '';
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (required && !cleaned) throw httpError(400, `${field} is required`);
  if (cleaned.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return cleaned;
};

exports.validateJob = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Job data is required');
  const status = text(body.status, 'Status', { max: 20 }) || 'Hiring';
  if (!STATUSES.has(status)) throw httpError(400, 'Status must be Hiring, Soon or Open');
  const sortOrder = Number(body.sortOrder);
  return {
    title: text(body.title, 'Title', { required: true, max: 160 }),
    icon: text(body.icon, 'Icon', { max: 60 }) || 'work',
    status,
    employment: text(body.employment, 'Employment type', { max: 80 }),
    location: text(body.location, 'Location', { max: 120 }),
    experience: text(body.experience, 'Experience', { max: 120 }),
    description: text(body.description, 'Description', { max: 2000 }),
    posted: text(body.posted, 'Posted label', { max: 80 }) || 'Posted recently',
    visible: body.visible !== false,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  };
};

exports.validateSettings = (body) => {
  if (!body || typeof body.sectionVisible !== 'boolean') throw httpError(400, 'sectionVisible must be true or false');
  return { sectionVisible: body.sectionVisible };
};
