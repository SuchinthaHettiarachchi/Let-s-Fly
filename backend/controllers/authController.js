const { httpError } = require('../middleware/error');
const { validateRegister, validateLogin, validateForgotPassword } = require('../validators/authValidator');
const authService = require('../services/authService');

const SESSION_COOKIE = 'letsfly_token';

const startSession = (res, user, remember) => {
  const token = authService.issueToken(user, remember);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
    path: '/',
  });
  return token;
};

exports.register = async (req, res) => {
  const user = await authService.createUser(validateRegister(req.body));
  const token = startSession(res, user, false);
  res.status(201).json({ ...user, token });
};

exports.login = async (req, res) => {
  const { email, password, remember } = validateLogin(req.body);
  const user = await authService.verifyCredentials(email, password);
  if (!user) throw httpError(401, 'Invalid credentials');

  const token = startSession(res, user, remember);
  res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.logout = async (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ message: 'Logged out' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = validateForgotPassword(req.body);
  const user = await authService.findUserByEmail(email);
  if (user) {
    // TODO: generate short-lived reset token and email it
  }
  res.json({ message: 'If an account exists for that email, a reset link has been sent' });
};