'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('businesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['grocery', 'food_processing'],
        allowNull: false,
        defaultValue: 'grocery'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'UTC'
      },
      subscription_plan: {
        type: Sequelize.ENUM,
        values: ['free', 'basic', 'pro'],
        allowNull: false,
        defaultValue: 'free'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    await queryInterface.addIndex('businesses', ['email']);
    await queryInterface.addIndex('businesses', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('businesses');
  }
};