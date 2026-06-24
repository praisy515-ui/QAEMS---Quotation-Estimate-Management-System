const { body } = require('express-validator');

const siteVisitRules = [
  body('clientId').trim().notEmpty().withMessage('Client ID link is required'),
  body('visitDate').trim().notEmpty().withMessage('Visit date is required'),
  body('address').trim().notEmpty().withMessage('Site address is required'),
  body('assignedDesigner').trim().notEmpty().withMessage('Assigned designer name is required'),
  body('status').optional().isIn(['Scheduled', 'Completed']).withMessage('Invalid site visit status value')
];

module.exports = siteVisitRules;
