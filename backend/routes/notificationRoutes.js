const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id/read', notificationController.markRead);
router.post('/read-all', notificationController.markAllRead);

module.exports = router;
