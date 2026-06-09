const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedPost = sequelize.define('SavedPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
}, {
  timestamps: true,
  tableName: 'saved_posts'
});

module.exports = SavedPost;
