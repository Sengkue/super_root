const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PushSubscription = sequelize.define('PushSubscription', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    keys: {
      type: DataTypes.JSON, // stores { p256dh, auth }
      allowNull: false
    }
  }, {
    tableName: 'push_subscriptions',
    timestamps: true
  });

  return PushSubscription;
};
