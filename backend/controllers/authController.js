const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { httpError } = require('../middleware/error');
const { validateRegister, validateLogin, validateForgotPassword } = require('../validators/authValidator');

const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);

exports.register = async (req, res) => {
  const { name, email, password } = validateRegister(req.body);
  const user = await User.create({ name, email, password: await User.hashPassword(password) });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.login = async (req, res) => {
  const { email, password } = validateLogin(req.body);
  const user = await User.findOne({ email }).select('+password');
  const valid = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
  if (!user || !valid) throw httpError(401, 'Invalid credentials');

  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.forgotPassword = async (req, res) => {
  const { email } = validateForgotPassword(req.body);
  const user = await User.findOne({ email });
  if (user) {
    // TODO: generate short-lived reset token and email it
  }
  res.json({ message: 'If an account exists for that email, a reset link has been sent' });
};