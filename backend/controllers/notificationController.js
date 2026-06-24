const dbHelper = require('../utils/dbHelper');

const getNotifications = async (req, res, next) => {
  try {
    const list = await dbHelper.getCollection('notifications');
    // Sort recent first
    const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: sorted
    });
  } catch (err) {
    return next(err);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const id = `NTF-${Date.now()}`;
    const notification = {
      title: req.body.title,
      message: req.body.message,
      status: req.body.status || 'Unread',
      createdAt: new Date().toISOString()
    };
    const created = await dbHelper.insert('notifications', id, notification);
    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: created
    });
  } catch (err) {
    return next(err);
  }
};

const markRead = async (req, res, next) => {
  const { id } = req.params;
  try {
    const notif = await dbHelper.getById('notifications', id);
    if (!notif) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        errors: []
      });
    }

    const updated = await dbHelper.update('notifications', id, { status: 'Read' });
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updated
    });
  } catch (err) {
    return next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const list = await dbHelper.getCollection('notifications');
    const updatedList = [];
    for (const notif of list) {
      if (notif.status !== 'Read') {
        const updated = await dbHelper.update('notifications', notif.id, { status: 'Read' });
        updatedList.push(updated);
      } else {
        updatedList.push(notif);
      }
    }
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: updatedList
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markRead,
  markAllRead
};
