'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
    },
    room_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
    },
    read_status:{
      type: DataTypes.BOOLEAN,
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
  Message.associate = (models) => {
    Message.belongsTo(models.users, {foreignKey: 'user_id',as:'users'});
    Message.belongsTo(models.rooms, {foreignKey: 'room_id' ,as:'rooms'});
    // Users.hasMany(models.userlogs, { foreignKey: 'user_id'});
    // Users.hasOne(models.promotions, {foreignKey: 'user_id', as: 'users'})
  };
  return Message;
};