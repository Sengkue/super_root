const User = require('../models/user.model');

// Controller functions
const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] } // Don't send passwords to client
      });
      res.status(200).json({
        success: true,
        data: users
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
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving user',
        error: error.message
      });
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    try {
      let { username, email, password } = req.body;
      
      // Basic validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide username and password'
        });
      }

      // Autogenerate email if not provided to satisfy the model
      if (!email) {
        email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@superroot.internal`;
      }

      // In a real application, you MUST hash the password here (e.g., with bcrypt)
      // Example: const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await User.create({
        username,
        email,
        password // Should be hashedPassword in production
      });

      // Remove password from response
      const userResponse = newUser.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  },

  // Login a user (simulated, no real password check for demo)
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
        }
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const userData = user.toJSON();
      delete userData.password;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: userData
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
  }
};

module.exports = userController;
