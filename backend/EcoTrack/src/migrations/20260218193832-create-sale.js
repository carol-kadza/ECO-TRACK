'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales', {
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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      quantity_sold: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      total_revenue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      sales_channel: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'in_store'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    await queryInterface.addIndex('sales', ['product_id']);
    await queryInterface.addIndex('sales', ['business_id']);
    await queryInterface.addIndex('sales', ['date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales');
  }
};