'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
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
  Users.associate = (models) => {
    Users.hasMany(models.message, { foreignKey: 'user_id'});
    Users.hasMany(models.relationship_room, { foreignKey: 'user_id'});
    // Users.hasOne(models.promotions, {foreignKey: 'user_id', as: 'users'})
  };
  return Users;
};