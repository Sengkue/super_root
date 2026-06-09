const { User, UserProfile, Post, Comment, Like, SavedPost } = require('../models');
const { Op } = require('sequelize');

const searchController = {
  globalSearch: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || q.trim() === '') {
        return res.status(200).json({ success: true, data: { users: [], posts: [] } });
      }

      const searchQuery = `%${q}%`;

      // Search Users (matching username or bio)
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: searchQuery } },
            { number: { [Op.iLike]: searchQuery } },
            { '$profile.bio$': { [Op.iLike]: searchQuery } }
          ]
        },
        include: [{ model: UserProfile, as: 'profile' }],
        attributes: ['id', 'username', 'number']
      });

      // Search Posts (matching content)
      const posts = await Post.findAll({
        where: {
          content: { [Op.iLike]: searchQuery }
        },
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'username'] },
          { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['id', 'username'] }] },
          { model: Like, as: 'likes', attributes: ['id', 'userId'] },
          { model: SavedPost, as: 'saves', attributes: ['id', 'userId'] }
        ]
      });

      res.status(200).json({ success: true, data: { users, posts } });
    } catch (error) {
      console.error('Error during global search:', error);
      res.status(500).json({ success: false, message: 'Internal server error during search' });
    }
  }
};

module.exports = searchController;
