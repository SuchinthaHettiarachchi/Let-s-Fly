const { httpError } = require('../middleware/error');
const { validateRegister, validateLogin, validateForgotPassword } = require('../validators/authValidator');
const authService = require('../services/authService');

exports.register = async (req, res) => {
  const user = await authService.createUser(validateRegister(req.body));
  res.status(201).json(user);
};

exports.login = async (req, res) => {
  const { email, password } = validateLogin(req.body);
  const user = await authService.verifyCredentials(email, password);
  if (!user) throw httpError(401, 'Invalid credentials');

  const token = authService.issueToken(user);
  res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.forgotPassword = async (req, res) => {
  const { email } = validateForgotPassword(req.body);
  const user = await authService.findUserByEmail(email);
  if (user) {
    // TODO: generate short-lived reset token and email it
  }
  res.json({ message: 'If an account exists for that email, a reset link has been sent' });
};