const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/summary', dashboardController.getSummary);
router.get('/activities', dashboardController.getRecentActivities);
router.get('/site-visits', dashboardController.getUpcomingVisits);

module.exports = router;
