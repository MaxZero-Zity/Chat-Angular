
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Relationship_Room = sequelize.define('relationship_room', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: 'users', key: 'id'
      }
    },
    room_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
          model: 'rooms', key: 'id'
        }
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
  Relationship_Room.associate = (models) => {
    Relationship_Room.belongsTo(models.users, { foreignKey: 'user_id' });
    Relationship_Room.belongsTo(models.rooms, { foreignKey: 'rooms_id' });
    // Users.hasMany(models.userlogs, { foreignKey: 'user_id'});
    // Users.hasOne(models.promotions, {foreignKey: 'user_id', as: 'users'})
  };
  return Relationship_Room;
};