const { body } = require('express-validator');

const clientRules = [
  body('name').trim().notEmpty().withMessage('Client name is required'),
  body('email').trim().isEmail().withMessage('Invalid email address format'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('projectType').optional().isIn(['Residential', 'Commercial']).withMessage('Project type must be Residential or Commercial'),
  body('status').optional().isIn(['Lead', 'Audit', 'Proposal', 'Signed', 'Completed']).withMessage('Invalid client status/stage value')
];

module.exports = clientRules;
