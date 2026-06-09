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

const followRoutes = require('./routes/follow.routes');
app.use('/api/follows', followRoutes);

const searchRoutes = require('./routes/search.routes');
app.use('/api/search', searchRoutes);

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
    const { User, UserProfile, Follow } = require('./models');
    
    let alice = await User.findOne({ where: { email: 'alice@superroot.com' } });
    if (!alice) {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('password123', 10);
      alice = await User.create({ username: 'Alice', email: 'alice@superroot.com', password: hash });
      let bob = await User.create({ username: 'Bob', email: 'bob@superroot.com', password: hash });
      let charlie = await User.create({ username: 'Charlie', email: 'charlie@superroot.com', password: hash });

      // Create profiles
      await UserProfile.create({ userId: alice.id, bio: 'do it now', livesIn: 'Ban Dongdok, Laos', worksAt: 'Systory' });
      await UserProfile.create({ userId: bob.id, bio: 'Hello World', livesIn: 'Vientiane', worksAt: 'Tech Co' });
      await UserProfile.create({ userId: charlie.id, bio: 'Coding is fun', livesIn: 'Luang Prabang', worksAt: 'Freelance' });

      // Create Dummy Follows
      await Follow.create({ followerId: bob.id, followingId: alice.id });
      await Follow.create({ followerId: charlie.id, followingId: alice.id });
      await Follow.create({ followerId: alice.id, followingId: bob.id });

      console.log('Dummy users (Alice, Bob, Charlie), their profiles, and follows initialized.');
    }

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
