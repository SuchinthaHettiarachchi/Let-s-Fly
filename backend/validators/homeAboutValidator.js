const { httpError } = require('../middleware/error');

const LINK_RE = /^(\/(?!\/)|https?:\/\/)/i;

const text = (value, field, max) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > max) throw httpError(400, `${field} must be ${max} characters or less`);
  return value;
};

const requiredText = (value, field, max) => {
  const result = text(value, field, max).trim();
  if (!result) throw httpError(400, `${field} is required`);
  return result;
};

const mediaUrl = (value, field) => {
  const result = text(value, field, 1000);
  if (result && !LINK_RE.test(result)) throw httpError(400, `${field} must be a site path (/.) or an http(s) URL`);
  return result;
};

exports.validateHomeAbout = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Home about content is required');
  const stats = Array.isArray(body.stats) ? body.stats : [];
  if (stats.length < 1 || stats.length > 6) throw httpError(400, 'Between 1 and 6 stats are allowed');
  const cleanedStats = stats.map((stat, index) => {
    const raw = stat && typeof stat === 'object' ? stat : {};
    return {
      value: requiredText(raw.value, `Stat ${index + 1} value`, 20),
      label: requiredText(raw.label, `Stat ${index + 1} label`, 80),
    };
  });
  return {
    eyebrow: text(body.eyebrow, 'Eyebrow', 60),
    heading: requiredText(body.heading, 'Heading', 160),
    paragraph: requiredText(body.paragraph, 'Paragraph', 2000),
    stats: cleanedStats,
    video: mediaUrl(body.video, 'Video'),
    videoPoster: mediaUrl(body.videoPoster, 'Video poster'),
    ratingScore: text(body.ratingScore, 'Google rating score', 10),
    ratingCount: text(body.ratingCount, 'Google review count', 12),
  };
};
