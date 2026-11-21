const { httpError } = require('../middleware/error');

const CATEGORIES = new Set(['Contact', 'Plan my Trip Section', 'Air Ticket', 'Visa Inquiry']);
const STATUSES = new Set(['New', 'In Progress', 'Closed']);

const text = (value, field, { required = false, max = 2000 } = {}) => {
  if (typeof value !== 'string') {
    if (required) throw httpError(400, `${field} is required`);
    return '';
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (required && !cleaned) throw httpError(400, `${field} is required`);
  if (cleaned.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return cleaned;
};

exports.validateSubmit = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Inquiry data is required');
  const category = text(body.category, 'Category', { required: true, max: 60 });
  if (!CATEGORIES.has(category)) throw httpError(400, 'Invalid inquiry category');
  return {
    customerName: text(body.customerName, 'Name', { required: true, max: 160 }),
    email: text(body.email, 'Email', { max: 200 }),
    phone: text(body.phone, 'Phone', { max: 60 }),
    category,
    subject: text(body.subject, 'Subject', { max: 200 }),
    message: text(body.message, 'Message', { max: 4000 }),
  };
};

exports.validateUpdate = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Inquiry data is required');
  const result = {};
  if (body.status !== undefined) {
    const status = text(body.status, 'Status', { max: 30 });
    if (!STATUSES.has(status)) throw httpError(400, 'Invalid status');
    result.status = status;
  }
  if (body.comment !== undefined) {
    const comment = text(body.comment, 'Comment', { max: 1000, required: true });
    result.comment = comment;
  }
  if (!Object.keys(result).length) throw httpError(400, 'Nothing to update');
  return result;
};
