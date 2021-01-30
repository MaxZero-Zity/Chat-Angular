'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('relationship_room', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', key: 'id'
        }
      },
      rooms_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rooms', key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('relationship_room');
  }
};