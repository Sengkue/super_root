const { User } = require('../models');

const trackActive = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.query?.viewerId || req.body?.viewerId;
    if (userId) {
      await User.update({ lastActiveAt: new Date() }, { where: { id: userId } });
    }
  } catch (error) {
    console.error('Failed to update lastActiveAt', error);
  }
  // Always continue to the next middleware/route handler, even if update fails
  next();
};

module.exports = trackActive;
