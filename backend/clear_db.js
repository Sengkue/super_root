const sequelize = require('./config/database');
const models = require('./models');

const clearDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Force sync drops all tables and recreates them
    await sequelize.sync({ force: true });
    
    console.log('All database tables have been dropped and recreated. Database is now empty.');
  } catch (error) {
    console.error('Unable to connect or sync database:', error);
  } finally {
    await sequelize.close();
  }
};

clearDatabase();
