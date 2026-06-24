const { body } = require('express-validator');

const loginRules = [
  body('email').trim().isEmail().withMessage('Invalid email address format'),
  body('password').notEmpty().withMessage('Password is required')
];

const registerRules = [
  body('email').trim().isEmail().withMessage('Invalid email address format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['Admin', 'Interior Designer']).withMessage('Role must be Admin or Interior Designer')
];

module.exports = {
  loginRules,
  registerRules
};
