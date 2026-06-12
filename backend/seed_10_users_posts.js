const sequelize = require('./config/database');
const { User, UserProfile, Post } = require('./models');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const hash = await bcrypt.hash('password123', 10);
    
    for (let i = 1; i <= 10; i++) {
      const username = `testuser${i}`;
      const number = `555000${i.toString().padStart(2, '0')}`;
      
      let user = await User.findOne({ where: { username } });
      if (!user) {
        user = await User.create({ username, number, password: hash });
        await UserProfile.create({ 
          userId: user.id, 
          bio: `Hello! I am test user ${i}.`, 
          livesIn: 'Test City', 
          worksAt: 'Test Corp' 
        });
        
        console.log(`Created user: ${username}`);
        
        // Create an example post for the user
        await Post.create({
          userId: user.id,
          content: `This is an example post from ${username}. Welcome to my profile!`
        });
        console.log(`Created post for: ${username}`);
      } else {
        console.log(`User ${username} already exists.`);
      }
    }

    console.log('Seed 10 users and posts complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
