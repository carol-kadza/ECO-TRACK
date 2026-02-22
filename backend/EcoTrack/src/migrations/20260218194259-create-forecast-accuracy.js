'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forecast_accuracy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      forecast_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'forecasts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      business_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'businesses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      forecast_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      predicted_demand: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      actual_demand: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      variance: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      accuracy_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      recorded_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    await queryInterface.addIndex('forecast_accuracy', ['forecast_id']);
    await queryInterface.addIndex('forecast_accuracy', ['product_id']);
    await queryInterface.addIndex('forecast_accuracy', ['business_id']);
    await queryInterface.addIndex('forecast_accuracy', ['forecast_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forecast_accuracy');
  }
};