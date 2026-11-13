const { httpError } = require('../middleware/error');

const MAX_SLIDES = 10;
const MAX_IMAGE_CHARS = 4000000;
const WEBP_RE = /^data:image\/webp;base64,[A-Za-z0-9+/]+={0,2}$/;
const LINK_RE = /^(\/(?!\/)|https?:\/\/)/i;
const URL_MAX = 1000;

// Hero media is stored as an R2 https URL. Legacy slides still carry base64
// WebP — accepted here, then uploaded to R2 by the controller before save.
const image = (value, field) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value !== 'string') throw httpError(400, `${field} must be an image URL`);
  if (WEBP_RE.test(value)) {
    if (value.length > MAX_IMAGE_CHARS) throw httpError(400, `${field} must be a WebP image`);
    return value;
  }
  if (value.length <= URL_MAX && /^(https?:\/\/)/i.test(value)) return value;
  throw httpError(400, `${field} must be an https image URL`);
};

exports.validateSlides = (body) => {
  if (!body || !Array.isArray(body.slides) || body.slides.length > MAX_SLIDES) {
    throw httpError(400, `slides must be an array of up to ${MAX_SLIDES} slots`);
  }
  return body.slides.map((slide) => {
    if (!slide || typeof slide !== 'object') throw httpError(400, 'Invalid hero slot');
    if (typeof slide.id !== 'string' || !slide.id.trim() || slide.id.length > 64) throw httpError(400, 'Hero slot id is required');
    const title = typeof slide.title === 'string' ? slide.title : '';
    const link = typeof slide.link === 'string' ? slide.link : '';
    if (title.length > 120) throw httpError(400, 'Banner title must be 120 chars or less');
    if (link.length > 500 || (link && !LINK_RE.test(link))) throw httpError(400, 'Link must be a site path (/…) or an http(s) URL');
    const active = slide.active === true;
    const desktop = image(slide.desktop, 'Desktop image');
    const mobile = image(slide.mobile, 'Mobile image');
    if (active && (!desktop || !mobile)) throw httpError(400, 'Visible slots need both desktop and mobile images');
    return { id: slide.id.trim(), title, link, active, desktop, mobile };
  });
};
