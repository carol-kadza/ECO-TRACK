'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alerts', {
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
      alert_type: {
        type: Sequelize.ENUM,
        values: ['surplus', 'expiry', 'low_stock', 'waste_risk'],
        allowNull: false
      },
      severity: {
        type: Sequelize.ENUM,
        values: ['info', 'warning', 'urgent', 'critical'],
        allowNull: false,
        defaultValue: 'info'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      recommended_action: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      quantity_at_risk: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      value_at_risk: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'resolved', 'dismissed'],
        allowNull: false,
        defaultValue: 'active'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    
    await queryInterface.addIndex('alerts', ['product_id']);
    await queryInterface.addIndex('alerts', ['business_id']);
    await queryInterface.addIndex('alerts', ['alert_type']);
    await queryInterface.addIndex('alerts', ['status']);
    await queryInterface.addIndex('alerts', ['severity']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alerts');
  }
};