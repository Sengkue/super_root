const { User, UserProfile, Post, Comment, Like, SavedPost } = require('./models');
const { Op } = require('sequelize');
const sequelize = require('./config/database');

async function run() {
  try {
    await sequelize.authenticate();
    const q = 'a';
    const searchQuery = `%${q}%`;
    console.log('Testing User.findAll...');
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: searchQuery } },
          { '$profile.bio$': { [Op.like]: searchQuery } }
        ]
      },
      include: [{ model: UserProfile, as: 'profile' }],
      attributes: ['id', 'username', 'number']
    });
    console.log('Users:', users.length);
    
    console.log('Testing Post.findAll...');
    const posts = await Post.findAll({
      where: {
        content: { [Op.like]: searchQuery }
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['id', 'username'] }] },
        { model: Like, as: 'likes', attributes: ['id', 'userId'] },
        { model: SavedPost, as: 'saves', attributes: ['id', 'userId'] }
      ]
    });
    console.log('Posts:', posts.length);
    console.log('Success!');
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await sequelize.close();
  }
}

run();
