const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/revenue', reportController.getRevenueReport);
router.get('/clients', reportController.getClientReport);
router.get('/quotations', reportController.getQuotationReport);
router.get('/approvals', reportController.getApprovalReport);
router.get('/site-visits', reportController.getSiteVisitReport);

module.exports = router;
