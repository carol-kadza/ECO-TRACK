'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CurrentInventory extends Model {
    static associate(models) {
      CurrentInventory.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      CurrentInventory.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business'
      });
      
      CurrentInventory.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updater'
      });
    }
  }
  
  CurrentInventory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'CurrentInventory',
    tableName: 'current_inventory',
    underscored: true,
    timestamps: false
  });
  
  return CurrentInventory;
};