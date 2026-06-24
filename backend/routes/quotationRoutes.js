const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const authMiddleware = require('../middleware/authMiddleware');
const { calcRules, createRules } = require('../validations/quotationValidation');
const validate = require('../middleware/validationMiddleware');

// Public live calculation endpoint for estimate preview
router.post('/calculate', calcRules, validate, quotationController.calculateQuotation);

// Authenticated quotation CRUD operations
router.use(authMiddleware);

router.post('/', createRules, validate, quotationController.createQuotation);
router.get('/', quotationController.getQuotations);
router.get('/:id', quotationController.getQuotationDetails);
router.put('/:id', createRules, validate, quotationController.updateQuotation);
router.post('/:id/status', quotationController.updateQuotationStatus);
router.patch('/:id/status', quotationController.updateQuotationStatus);
router.delete('/:id', quotationController.deleteQuotation);

module.exports = router;
