'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      Alert.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      Alert.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business'
      });
    }
  }
  
  Alert.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id'
      }
    },
    alert_type: {
      type: DataTypes.ENUM('surplus', 'expiry', 'low_stock', 'waste_risk'),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'urgent', 'critical'),
      allowNull: false,
      defaultValue: 'info'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recommended_action: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantity_at_risk: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    value_at_risk: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'active'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Alert',
    tableName: 'alerts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Alert;
};