const express = require('express');
const router = express.Router();
const siteVisitController = require('../controllers/siteVisitController');
const authMiddleware = require('../middleware/authMiddleware');
const siteVisitRules = require('../validations/siteVisitValidation');
const validate = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.post('/', siteVisitRules, validate, siteVisitController.createVisit);
router.get('/', siteVisitController.getVisits);
router.get('/:id', siteVisitController.getVisitDetails);
router.put('/:id', siteVisitRules, validate, siteVisitController.updateVisit);
router.delete('/:id', siteVisitController.deleteVisit);

module.exports = router;
