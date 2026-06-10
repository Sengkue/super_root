const { User, UserProfile } = require('../models');
const bcrypt = require('bcrypt');

// Controller functions
const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const { viewerId } = req.query;
      const users = await User.findAll({
        attributes: { exclude: ['password'] }, // Don't send passwords to client
        include: [{ model: UserProfile, as: 'profile' }]
      });
      
      let followingIds = new Set();
      if (viewerId) {
        const { Follow } = require('../models');
        const follows = await Follow.findAll({ where: { followerId: viewerId } });
        followingIds = new Set(follows.map(f => f.followingId));
      }

      const usersWithFollowStatus = users.map(u => {
        const userData = u.toJSON();
        const isOnline = userData.lastActiveAt ? (new Date() - new Date(userData.lastActiveAt)) < 5 * 60 * 1000 : false;
        return {
          ...userData,
          isFollowing: followingIds.has(userData.id),
          isOnline
        };
      });

      res.status(200).json({
        success: true,
        data: usersWithFollowStatus
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: error.message
      });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const { viewerId } = req.query;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{ model: UserProfile, as: 'profile' }]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Get follower counts
      const followersCount = await user.countFollowers();
      const followingCount = await user.countFollowing();

      let isFollowing = false;
      if (viewerId) {
        const { Follow } = require('../models');
        const followRecord = await Follow.findOne({
          where: { followerId: viewerId, followingId: id }
        });
        isFollowing = !!followRecord;
      }

      const isOnline = user.lastActiveAt ? (new Date() - new Date(user.lastActiveAt)) < 5 * 60 * 1000 : false;

      res.status(200).json({ 
        success: true, 
        data: {
          ...user.toJSON(),
          followersCount,
          followingCount,
          isFollowing,
          isOnline
        }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
    }
  },

  // Create new user (Sign up)
  createUser: async (req, res) => {
    try {
      const { username, number, password } = req.body;

      // Validate basic input
      if (!username || !number || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username, number and password' });
      }

      const existingUser = await User.findOne({ where: { number } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Number already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        username,
        number,
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: user.id,
          username: user.username,
          number: user.number
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
      
      if (!emailOrPhone || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username and password' });
      }

      // We find the user by username or email for this demo
      const { Op } = require('sequelize');
      const user = await User.findOne({
        where: { 
          [Op.or]: [
            { number: emailOrPhone },
            { username: emailOrPhone }
          ]
        },
        include: [{ model: UserProfile, as: 'profile' }]
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const userData = user.toJSON();
      delete userData.password;

      // Also attach follower counts since login populates authStore.activeUserObj
      const followersCount = await user.countFollowers();
      const followingCount = await user.countFollowing();

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          ...userData,
          followersCount,
          followingCount
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
  },

  // Update User Profile
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { bio, livesIn, worksAt, profileImage, coverImage, email, firstName, lastName, language, emailNotifications, pushNotifications, isPrivate } = req.body;

      // Ensure the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Find or create profile
      let profile = await UserProfile.findOne({ where: { userId: id } });
      if (!profile) {
        profile = await UserProfile.create({ userId: id, bio, livesIn, worksAt, profileImage, coverImage, email, firstName, lastName, language, emailNotifications, pushNotifications, isPrivate });
      } else {
        await profile.update({ bio, livesIn, worksAt, profileImage, coverImage, email, firstName, lastName, language, emailNotifications, pushNotifications, isPrivate });
      }

      // Fetch updated user with profile and counts
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{ model: UserProfile, as: 'profile' }]
      });

      const followersCount = await updatedUser.countFollowers();
      const followingCount = await updatedUser.countFollowing();

      const isOnline = updatedUser.lastActiveAt ? (new Date() - new Date(updatedUser.lastActiveAt)) < 5 * 60 * 1000 : false;

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...updatedUser.toJSON(),
          followersCount,
          followingCount,
          isOnline
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new password are required' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect current password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
    }
  }
};

module.exports = userController;
