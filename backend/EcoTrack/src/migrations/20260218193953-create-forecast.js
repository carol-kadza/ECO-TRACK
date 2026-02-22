'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forecasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      recommended_stock: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      confidence_level: {
        type: Sequelize.ENUM,
        values: ['low', 'medium', 'high'],
        allowNull: false,
        defaultValue: 'medium'
      },
      reasoning: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      forecast_method: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'moving_average'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    await queryInterface.addIndex('forecasts', ['product_id']);
    await queryInterface.addIndex('forecasts', ['business_id']);
    await queryInterface.addIndex('forecasts', ['forecast_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forecasts');
  }
};