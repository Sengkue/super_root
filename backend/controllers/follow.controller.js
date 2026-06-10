const { User, Follow } = require('../models');
const { createNotification } = require('../utils/notification');

const followController = {
  followUser: async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
      
      if (!followerId || !followingId) {
        return res.status(400).json({ success: false, message: 'Missing user IDs' });
      }

      const [follow, created] = await Follow.findOrCreate({
        where: { followerId, followingId }
      });

      if (created) {
        const follower = await User.findByPk(followerId);
        if (follower) {
          await createNotification({
            userId: followingId,
            type: 'follow',
            message: `${follower.username} started following you`,
            link: `/user/profile?id=${followerId}`
          });
        }
      }

      res.status(200).json({ success: true, message: 'User followed successfully' });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ success: false, message: 'Failed to follow user', error: error.message });
    }
  },

  unfollowUser: async (req, res) => {
    try {
      const { followerId, followingId } = req.body;

      if (!followerId || !followingId) {
        return res.status(400).json({ success: false, message: 'Missing user IDs' });
      }

      await Follow.destroy({
        where: { followerId, followingId }
      });

      res.status(200).json({ success: true, message: 'User unfollowed successfully' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ success: false, message: 'Failed to unfollow user', error: error.message });
    }
  }
};

module.exports = followController;
