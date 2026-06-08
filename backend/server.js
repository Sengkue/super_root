require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import models
const User = require('./models/user.model');

// Import routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Database sync and server startup
const startServer = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models to database
    // Note: Use { force: true } or { alter: true } only in development
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Seed dummy users if not exists
    const { User } = require('./models');
    
    const defaultUsers = [
      { username: 'Alice', email: 'alice@superroot.com', password: 'hash' },
      { username: 'Bob', email: 'bob@superroot.com', password: 'hash' },
      { username: 'Charlie', email: 'charlie@superroot.com', password: 'hash' }
    ];

    for (const u of defaultUsers) {
      await User.findOrCreate({
        where: { username: u.username },
        defaults: u
      });
    }
    console.log(`Dummy users (Alice, Bob, Charlie) initialized.`);

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
