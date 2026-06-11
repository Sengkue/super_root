const sequelize = require('./config/database');
const { User, UserProfile } = require('./models');
const bcrypt = require('bcrypt');

const seed = async () => {
  await sequelize.authenticate();
  const hash = await bcrypt.hash('123456', 10);
  
  let user01 = await User.findOne({ where: { username: 'user01' } });
  if (!user01) {
    user01 = await User.create({ username: 'user01', number: '010101', password: hash });
    await UserProfile.create({ userId: user01.id, bio: 'User 01', livesIn: '', worksAt: '' });
  }

  let user02 = await User.findOne({ where: { username: 'user02' } });
  if (!user02) {
    user02 = await User.create({ username: 'user02', number: '020202', password: hash });
    await UserProfile.create({ userId: user02.id, bio: 'User 02', livesIn: '', worksAt: '' });
  }

  console.log('Seed complete for user01 and user02');
  process.exit(0);
};

seed();
