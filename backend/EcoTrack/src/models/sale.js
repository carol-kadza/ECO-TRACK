'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      Sale.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business'
      });
    }
  }
  
  Sale.init({
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    quantity_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    total_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    sales_channel: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'in_store'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  
  return Sale;
};