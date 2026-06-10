const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// Fetch notifications for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Create a notification
router.post('/', async (req, res) => {
  try {
    const { userId, type, message, link } = req.body;
    const notification = await Notification.create({
      userId,
      type,
      message,
      link
    });
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

// Mark a specific notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.update({ isRead: true }, { where: { id } });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

// Mark all notifications as read for a user
router.put('/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
});

module.exports = router;
