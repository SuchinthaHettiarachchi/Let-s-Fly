const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);

exports.verifyCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  const valid = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
  return user && valid ? user : null;
};

exports.issueToken = (user, remember = false) =>
  jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: remember ? '7d' : config.jwtExpiresIn,
  });
