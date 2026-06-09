const { SavedPost } = require('../backend/models');

async function test() {
  const saves = await SavedPost.findAll();
  console.log('Total saves:', saves.length);
  console.log(saves.map(s => s.toJSON()));
}
test();
