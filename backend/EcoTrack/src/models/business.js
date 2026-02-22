'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      // Business has many Users
      Business.hasMany(models.User, {
        foreignKey: 'business_id',
        as: 'users'
      });
      
      // Business has many Products
      Business.hasMany(models.Product, {
        foreignKey: 'business_id',
        as: 'products'
      });
      
      // Business has many Alerts
      Business.hasMany(models.Alert, {
        foreignKey: 'business_id',
        as: 'alerts'
      });
    }
  }
  
  Business.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    type: {
      type: DataTypes.ENUM('grocery', 'food_processing'),
      allowNull: false,
      defaultValue: 'grocery'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC'
    },
    subscription_plan: {
      type: DataTypes.ENUM('free', 'basic', 'pro'),
      allowNull: false,
      defaultValue: 'free'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Business',
    tableName: 'businesses',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Business;
};