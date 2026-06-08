const { Post, Comment, Like, User } = require('../models');

// Helper to get active user ID from headers or fallback to Alice
const getActiveUserId = async (req) => {
  const headerUserId = req.headers['userid'];
  if (headerUserId) {
    const user = await User.findByPk(headerUserId);
    if (user) return user.id;
  }
  // Fallback
  const fallback = await User.findOne({ where: { username: 'Alice' } });
  return fallback ? fallback.id : null;
};

const postController = {
  // Get all users (useful for user switcher)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({ attributes: ['id', 'username'] });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  },

  // Get all posts for the feed
  getFeed: async (req, res) => {
    try {
      const posts = await Post.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'username'] },
          { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['id', 'username'] }] },
          { model: Like, as: 'likes', attributes: ['id', 'userId'] }
        ]
      });
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      console.error('Error fetching feed:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch feed' });
    }
  },

  // Get posts by a specific user (for profile page)
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'username'] },
          { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['id', 'username'] }] },
          { model: Like, as: 'likes', attributes: ['id', 'userId'] }
        ]
      });
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user posts' });
    }
  },

  // Create a new post
  createPost: async (req, res) => {
    try {
      const { content, imageUrl } = req.body;
      const userId = await getActiveUserId(req);

      if (!userId) return res.status(400).json({ success: false, message: 'User not found' });
      if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

      const post = await Post.create({ content, imageUrl, userId });
      
      const createdPost = await Post.findByPk(post.id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'username'] },
          { model: Comment, as: 'comments' },
          { model: Like, as: 'likes' }
        ]
      });

      res.status(201).json({ success: true, data: createdPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ success: false, message: 'Failed to create post' });
    }
  },

  // Add a comment to a post
  addComment: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const { content, parentId } = req.body;
      const userId = await getActiveUserId(req);

      if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

      // Verify post exists
      const post = await Post.findByPk(postId);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      // If parentId provided, verify it belongs to the same post
      if (parentId) {
        const parentComment = await Comment.findByPk(parentId);
        if (!parentComment || parentComment.postId !== postId) {
          return res.status(400).json({ success: false, message: 'Invalid parent comment' });
        }
      }

      const comment = await Comment.create({ content, postId, userId, parentId: parentId || null });
      
      const createdComment = await Comment.findByPk(comment.id, {
        include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
      });

      res.status(201).json({ success: true, data: createdComment });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
  },

  // Toggle like on a post
  toggleLike: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const userId = await getActiveUserId(req);

      const existingLike = await Like.findOne({ where: { postId, userId } });

      if (existingLike) {
        await existingLike.destroy();
        res.status(200).json({ success: true, message: 'Unliked post', action: 'unliked' });
      } else {
        await Like.create({ postId, userId });
        res.status(201).json({ success: true, message: 'Liked post', action: 'liked' });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ success: false, message: 'Failed to toggle like' });
    }
  },

  // Update a post
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { content, imageUrl } = req.body;
      const userId = await getActiveUserId(req);

      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      
      const post = await Post.findByPk(id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      if (post.userId !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });

      if (content !== undefined) post.content = content;
      if (imageUrl !== undefined) post.imageUrl = imageUrl;
      await post.save();

      res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ success: false, message: 'Failed to update post' });
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = await getActiveUserId(req);

      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const post = await Post.findByPk(id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      if (post.userId !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });
      const { Op } = require('sequelize');
      await Comment.destroy({ where: { postId: id, parentId: { [Op.not]: null } } });
      await Comment.destroy({ where: { postId: id } });
      await Like.destroy({ where: { postId: id } });
      await post.destroy();
      res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ success: false, message: 'Failed to delete post' });
    }
  }
};

module.exports = postController;
