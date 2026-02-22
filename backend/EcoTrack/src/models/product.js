'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business'
      });
      
      Product.hasOne(models.CurrentInventory, {
        foreignKey: 'product_id',
        as: 'current_inventory'
      });
      
      Product.hasMany(models.InventoryTransaction, {
        foreignKey: 'product_id',
        as: 'transactions'
      });
      
      Product.hasMany(models.Sale, {
        foreignKey: 'product_id',
        as: 'sales'
      });
      
      Product.hasMany(models.Forecast, {
        foreignKey: 'product_id',
        as: 'forecasts'
      });
      
      Product.hasMany(models.Alert, {
        foreignKey: 'product_id',
        as: 'alerts'
      });
    }
  }
  
  Product.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'general'
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pieces',
      // validate: {
      //   isIn: [['pieces', 'kg', 'liters', 'boxes', 'units']]
      // }
    },
    shelf_life_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    reorder_point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    },
    production_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    is_perishable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Product;
};