'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ForecastAccuracy extends Model {
    static associate(models) {
      ForecastAccuracy.belongsTo(models.Forecast, {
        foreignKey: 'forecast_id',
        as: 'forecast'
      });
      
      ForecastAccuracy.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      
      ForecastAccuracy.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business'
      });
    }
  }
  
  ForecastAccuracy.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    forecast_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forecasts',
        key: 'id'
      }
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
      allowNull: false
    },
    actual_demand: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    variance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accuracy_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ForecastAccuracy',
    tableName: 'forecast_accuracy',
    underscored: true,
    timestamps: true,
    createdAt: 'recorded_at',
    updatedAt: false
  });
  
  return ForecastAccuracy;
};