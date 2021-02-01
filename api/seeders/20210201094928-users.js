'use strict';
const Model = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Model.users.bulkCreate([
      {
        email:'twinsynergy@gmail.com',
        name:'twinsynergy@gmail.com',
        status:true,
        createdAt:'2020-12-24 06:20:49',
        updatedAt:'2020-12-24 06:20:49'
      },
      {
        email:'maxzerozity@gmail.com',
        name:'maxzerozity@gmail.com',
        status:true,
        createdAt:'2020-12-24 06:20:49',
        updatedAt:'2020-12-24 06:20:49'
      }
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
