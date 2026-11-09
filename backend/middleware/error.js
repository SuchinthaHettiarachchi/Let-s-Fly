const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON' });
  if (err.code === 11000) return res.status(409).json({ message: 'Registration failed' });
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message || 'Server error' });
};

module.exports = { httpError, errorHandler };