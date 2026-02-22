'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Forecast extends Model {
    static associate(models) {
      Forecast.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      Forecast.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business'
      });
      
      Forecast.hasOne(models.ForecastAccuracy, {
        foreignKey: 'forecast_id',
        as: 'accuracy'
      });
    }
  }
  
  Forecast.init({
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
    forecast_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    predicted_demand: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    recommended_stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    confidence_level: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium'
    },
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    forecast_method: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'moving_average'
    }
  }, {
    sequelize,
    modelName: 'Forecast',
    tableName: 'forecasts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  
  return Forecast;
};