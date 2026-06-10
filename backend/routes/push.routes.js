const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const { PushSubscription } = require('../models');

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Expose public VAPID key to the frontend
router.get('/vapid-public-key', (req, res) => {
  res.json({ success: true, publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Save a new push subscription
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    
    // Check if subscription already exists for this endpoint
    const existing = await PushSubscription.findOne({ where: { endpoint: subscription.endpoint } });
    
    if (existing) {
      if (existing.userId !== userId) {
        existing.userId = userId;
        await existing.save();
      }
    } else {
      await PushSubscription.create({
        userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys
      });
    }
    
    res.json({ success: true, message: 'Subscribed to push notifications' });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
});

// Unsubscribe (optional cleanup)
router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    await PushSubscription.destroy({ where: { endpoint } });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
});

module.exports = router;
