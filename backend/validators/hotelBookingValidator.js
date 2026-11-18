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
  if (result && !LINK_RE.test(result)) throw httpError(400, `${field} must be a site path (/...) or an http(s) URL`);
  return result;
};

const ctaUrl = (value, field) => {
  const result = text(value, field, 1000);
  if (result && !LINK_RE.test(result) && !/^mailto:/i.test(result) && !/^tel:/i.test(result)) {
    throw httpError(400, `${field} must be a site path, http(s) URL, mailto: or tel: link`);
  }
  return result;
};

exports.validateHotelBooking = (body) => {
  if (!body || typeof body !== 'object') throw httpError(400, 'Hotel booking content is required');
  const stats = Array.isArray(body.stats) ? body.stats : [];
  if (stats.length > 4) throw httpError(400, 'Up to 4 stats are allowed');
  const cleanedStats = stats.map((stat, index) => {
    const raw = stat && typeof stat === 'object' ? stat : {};
    return {
      value: text(raw.value, `Stat ${index + 1} value`, 30),
      label: text(raw.label, `Stat ${index + 1} label`, 60),
    };
  }).filter((s) => s.value || s.label);

  return {
    eyebrow: text(body.eyebrow, 'Eyebrow', 60),
    title: requiredText(body.title, 'Title', 160),
    description: requiredText(body.description, 'Description', 1200),
    stats: cleanedStats,
    ctaLabel: text(body.ctaLabel, 'Button label', 60),
    ctaUrl: ctaUrl(body.ctaUrl, 'Button URL'),
    ctaNote: text(body.ctaNote, 'Button note', 120),
    whatsappMessage: text(body.whatsappMessage, 'WhatsApp message', 300),
    imagePrimary: mediaUrl(body.imagePrimary, 'Primary image'),
    imageSecondary: mediaUrl(body.imageSecondary, 'Secondary image'),
    priceLabel: text(body.priceLabel, 'Price label', 40),
    priceAmount: text(body.priceAmount, 'Price amount', 40),
    priceSuffix: text(body.priceSuffix, 'Price suffix', 40),
  };
};
