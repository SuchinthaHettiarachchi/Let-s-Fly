const { httpError } = require('../middleware/error');

exports.validateLogin = (body) => {
  const { email, password } = body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) throw httpError(400, 'Email and password are required');
  return { email: email.toLowerCase(), password, remember: body.remember === true };
};
