const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { httpError } = require('./error');

const COOKIE = 'letsfly_token';

// No cookie-parser dependency: read the session cookie straight off the header.
const readToken = (req) => {
  const cookie = req.headers.cookie || '';
  const entry = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  if (entry) return entry.slice(COOKIE.length + 1);
  const auth = req.headers.authorization;
  return auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
};

module.exports = (req, res, next) => {
  const token = readToken(req);
  if (!token) throw httpError(401, 'Authentication required');
  try {
    req.user = jwt.verify(token, config.jwtSecret);
  } catch {
    throw httpError(401, 'Session expired or invalid');
  }
  next();
};
