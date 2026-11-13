const { httpError } = require('../middleware/error');
const { validateLogin } = require('../validators/authValidator');
const authService = require('../services/authService');
const config = require('../config/config');

const SESSION_COOKIE = 'letsfly_token';

const startSession = (res, user, remember) => {
  const token = authService.issueToken(user, remember);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: config.cookieDomain,
    maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
    path: '/',
  });
  return token;
};

exports.login = async (req, res) => {
  const { email, password, remember } = validateLogin(req.body);
  const user = await authService.verifyCredentials(email, password);
  if (!user) throw httpError(401, 'Invalid credentials');

  const token = startSession(res, user, remember);
  res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.logout = async (req, res) => {
  res.clearCookie(SESSION_COOKIE, { domain: config.cookieDomain, path: '/' });
  res.json({ message: 'Logged out' });
};
