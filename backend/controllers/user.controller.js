const { User, UserProfile } = require('../models');

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
        return {
          ...userData,
          isFollowing: followingIds.has(userData.id)
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

      res.status(200).json({ 
        success: true, 
        data: {
          ...user.toJSON(),
          followersCount,
          followingCount,
          isFollowing
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
      const { username, email, password } = req.body;

      // Validate basic input
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username, email and password' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: user.id,
          username: user.username,
          email: user.email
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
            { email: emailOrPhone },
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
      const { bio, livesIn, worksAt, profileImage, coverImage } = req.body;

      // Ensure the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Find or create profile
      let profile = await UserProfile.findOne({ where: { userId: id } });
      if (!profile) {
        profile = await UserProfile.create({ userId: id, bio, livesIn, worksAt, profileImage, coverImage });
      } else {
        await profile.update({ bio, livesIn, worksAt, profileImage, coverImage });
      }

      // Fetch updated user with profile and counts
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{ model: UserProfile, as: 'profile' }]
      });

      const followersCount = await updatedUser.countFollowers();
      const followingCount = await updatedUser.countFollowing();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...updatedUser.toJSON(),
          followersCount,
          followingCount
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
  }
};

module.exports = userController;
