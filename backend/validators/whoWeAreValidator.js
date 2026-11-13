const { httpError } = require('../middleware/error');

const LINK_RE = /^(\/(?!\/)|https?:\/\/)/i;

const text = (value, field, max) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return value;
};

const mediaUrl = (value, field) => {
  const result = text(value, field, 1000);
  if (result && !LINK_RE.test(result)) throw httpError(400, `${field} must be a site path (/.) or an http(s) URL`);
  return result;
};

exports.validateWhoWeAre = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Who we are content is required');
  const paragraphs = Array.isArray(body.paragraphs) ? body.paragraphs : [];
  if (paragraphs.length > 8) throw httpError(400, 'Up to 8 paragraphs are allowed');
  const cleanedParagraphs = paragraphs.map((paragraph, index) => {
    const result = text(paragraph, `Paragraph ${index + 1}`, 2000);
    if (!result) throw httpError(400, `Paragraph ${index + 1} cannot be empty`);
    return result;
  });
  const rawQuote = body.quote && typeof body.quote === 'object' ? body.quote : {};
  return {
    eyebrow: text(body.eyebrow, 'Eyebrow', 60),
    headingLead: text(body.headingLead, 'Heading', 120),
    headingHighlight: text(body.headingHighlight, 'Heading highlight', 120),
    paragraphs: cleanedParagraphs,
    quote: {
      initials: text(rawQuote.initials, 'Quote initials', 5),
      quote: text(rawQuote.quote, 'Quote', 500),
      name: text(rawQuote.name, 'Quote name', 80),
      role: text(rawQuote.role, 'Quote role', 120),
    },
    statValue: text(body.statValue, 'Stat value', 20),
    statLabel: text(body.statLabel, 'Stat label', 80),
    mainImage: mediaUrl(body.mainImage, 'Main image'),
    insetImage: mediaUrl(body.insetImage, 'Inset image'),
    video: mediaUrl(body.video, 'Video'),
  };
};
