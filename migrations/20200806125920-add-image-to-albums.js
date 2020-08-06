'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Albums', 'image', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Albums', 'image');
  }
};
