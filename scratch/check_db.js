const { Follow, User } = require('../backend/models');

async function test() {
  const users = await User.findAll();
  console.log('Users:', users.map(u => ({ id: u.id, username: u.username })));

  const follows = await Follow.findAll();
  console.log('Follows:', follows.map(f => f.toJSON()));
}

test().catch(console.error).finally(() => process.exit(0));
