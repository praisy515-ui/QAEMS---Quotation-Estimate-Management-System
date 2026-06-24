const { body } = require('express-validator');

const calcRules = [
  body('roomType').trim().notEmpty().withMessage('Room Type is required')
    .isIn(['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Office Space', 'Dining Room'])
    .withMessage('Invalid room type selected'),
  body('area').isFloat({ min: 1 }).withMessage('Area must be a positive number'),
  body('labourCost').optional().isFloat({ min: 0 }).withMessage('Labour cost must be a non-negative number'),
  body('tax').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100'),
  body('taxPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
  body('discountPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100')
];

const createRules = [
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  ...calcRules,
  body('status').optional().isIn(['Draft', 'Under Review', 'Approved', 'Rejected', 'Completed']).withMessage('Invalid status value')
];

module.exports = {
  calcRules,
  createRules
};
