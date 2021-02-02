'use strict';
const Model = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Model.relationship_rooms.bulkCreate([
      {
        user_id:1,
        room_id:1,
        friend_id:2,
        createdAt:'2020-12-24 06:20:49',
        updatedAt:'2020-12-24 06:20:49',
      },
      {
        user_id:2,
        room_id:1,
        friend_id:1,
        createdAt:'2020-12-24 06:20:49',
        updatedAt:'2020-12-24 06:20:49',
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('relationship_rooms', null, {});
  }
};
