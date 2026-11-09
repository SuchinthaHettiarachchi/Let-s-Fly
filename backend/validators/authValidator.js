const { httpError } = require('../middleware/error');

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

exports.validateRegister = (body) => {
  const { name, email, password } = body;
  if (typeof name !== 'string' || !name.trim() || name.length > 50) throw httpError(400, 'Name is required (max 50 chars)');
  if (typeof email !== 'string' || email.length > 100 || !EMAIL_RE.test(email)) throw httpError(400, 'Invalid email');
  if (typeof password !== 'string' || !PASSWORD_RE.test(password)) throw httpError(400, 'Password must be 8-72 chars with uppercase, lowercase and a number');
  return { name: name.trim(), email: email.toLowerCase(), password };
};

exports.validateLogin = (body) => {
  const { email, password } = body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) throw httpError(400, 'Email and password are required');
  return { email: email.toLowerCase(), password };
};

exports.validateForgotPassword = (body) => {
  const { email } = body;
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) throw httpError(400, 'Invalid email');
  return { email: email.toLowerCase() };
};