'use strict';
const Model = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Model.rooms.bulkCreate([
      {
        name:'TestRoom',
        status:true,
        createdAt:'2020-12-24 06:20:49',
        updatedAt:'2020-12-24 06:20:49'
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
