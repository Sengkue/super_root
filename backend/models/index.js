const sequelize = require('../config/database');
const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const UserProfile = require('./userProfile.model');
const Follow = require('./follow.model');

// Define Relationships

// User <-> UserProfile
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> User (Followers / Following)
User.belongsToMany(User, { through: Follow, as: 'followers', foreignKey: 'followingId', otherKey: 'followerId' });
User.belongsToMany(User, { through: Follow, as: 'following', foreignKey: 'followerId', otherKey: 'followingId' });

// User <-> Post
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> Comment
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> Like
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> Like
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Comment <-> Comment (Replies)
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

module.exports = {
  sequelize,
  User,
  UserProfile,
  Post,
  Comment,
  Like,
  Follow
};
