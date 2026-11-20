const { httpError } = require('../middleware/error');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.validateSubscribe = (body) => {
  if (!body || typeof body.email !== 'string') throw httpError(400, 'Email is required');
  const email = body.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) throw httpError(400, 'Enter a valid email address');
  return { email, source: typeof body.source === 'string' ? body.source.slice(0, 60) : 'website' };
};
