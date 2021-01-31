'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define('rooms', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },   
    friend_id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    status: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
  }, {
    force: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  Rooms.associate = (models) => {
    Rooms.belongsTo(models.users, {foreignKey: 'user_id'});
    Rooms.belongsTo(models.users, {foreignKey: 'friend_id'});
    Rooms.hasMany(models.relationship_room, { foreignKey: 'room_id'});
    // Users.hasOne(models.promotions, {foreignKey: 'user_id', as: 'users'})
  };
  return Rooms;
};