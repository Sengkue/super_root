const { Notification, PushSubscription } = require('../models');
const webpush = require('web-push');

const createNotification = async ({ userId, type, message, link }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      link
    });

    // Fetch all push subscriptions for this user
    const subscriptions = await PushSubscription.findAll({ where: { userId } });
    
    // Send push notification to all user's devices
    const payload = JSON.stringify({
      title: 'Super Root',
      body: message,
      url: link,
      icon: '/icon.png'
    });

    subscriptions.forEach(sub => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: sub.keys
      };
      
      webpush.sendNotification(pushConfig, payload)
        .catch(err => {
          console.error('Push notification failed for endpoint:', sub.endpoint, err);
          if (err.statusCode === 410 || err.statusCode === 404) {
             PushSubscription.destroy({ where: { id: sub.id } });
          }
        });
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification via utility:', error);
    return null;
  }
};

module.exports = { createNotification };
