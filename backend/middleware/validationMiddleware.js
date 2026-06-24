const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map(err => `${err.path}: ${err.msg}`);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errorList
    });
  }
  next();
};

module.exports = validate;
