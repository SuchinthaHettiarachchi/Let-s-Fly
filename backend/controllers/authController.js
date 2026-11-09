const User = require('../models/User');

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ id: user._id, name, email, role: user.role });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  // Generate JWT - will be handled by error middleware if jwt fails
  res.json({ id: user._id, name, email, role: user.role });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  // In real app: send reset token email
  res.json({ message: 'Password reset email sent' });
};