const { httpError } = require('../middleware/error');

const CATEGORIES = new Set(['meetings', 'incentives', 'conferences', 'exhibitions']);
const STATUSES = new Set(['draft', 'published']);
const LINK_RE = /^(\/(?!\/)|https?:\/\/)/i;

const text = (value, field, { required = false, max = 5000 } = {}) => {
  if (typeof value !== 'string') {
    if (required) throw httpError(400, `${field} is required`);
    return '';
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (required && !cleaned) throw httpError(400, `${field} is required`);
  if (cleaned.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return cleaned;
};

const html = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  if (/<script[\s\S]*?<\/script>/i.test(value)) throw httpError(400, 'Description contains disallowed markup');
  return value.slice(0, 200000);
};

const image = (value) => {
  if (!value || typeof value !== 'object') return { src: '', alt: '', name: '' };
  const src = typeof value.src === 'string' ? value.src.trim() : '';
  if (src && !LINK_RE.test(src)) throw httpError(400, 'Image must be a local path or http(s) URL');
  return {
    src,
    alt: text(value.alt, 'Alt text', { max: 200 }),
    name: text(value.name, 'Image name', { max: 200 }),
  };
};

const images = (value) => {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 30).map(image);
};

const slug = (value) => {
  const base = text(value || '', 'Slug', { max: 140 }).toLowerCase();
  const clean = base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!clean) throw httpError(400, 'Slug is required');
  return clean;
};

exports.validateProject = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Project data is required');
  const category = text(body.category, 'Category', { required: true, max: 30 });
  if (!CATEGORIES.has(category)) throw httpError(400, 'Category must be meetings, incentives, conferences or exhibitions');
  const status = text(body.status, 'Status', { max: 20 }) || 'draft';
  if (!STATUSES.has(status)) throw httpError(400, 'Status must be draft or published');
  if (status === 'published') {
    if (!text(body.title, 'Title', { required: true, max: 160 })) throw httpError(400, 'Title is required');
    if (!text(body.summary, 'Summary', { required: true, max: 400 })) throw httpError(400, 'Summary is required');
    if (!text(body.date, 'Date', { required: true, max: 20 })) throw httpError(400, 'Date is required');
  }
  return {
    slug: slug(body.slug || body.title),
    title: text(body.title, 'Title', { required: true, max: 160 }),
    category,
    date: text(body.date, 'Date', { max: 20 }),
    summary: text(body.summary, 'Summary', { max: 400 }),
    description: html(body.description),
    cover: image(body.cover),
    gallery: images(body.gallery),
    status,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
};
