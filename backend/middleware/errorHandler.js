const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message]
  });
};

module.exports = errorHandler;
