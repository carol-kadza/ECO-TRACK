const { Alert, Product, CurrentInventory, InventoryTransaction } = require('../models');
const { Op } = require('sequelize');
const forecastService = require('./forecastService');

class AlertGenerationService {
  async generateAlertsForBusiness(businessId) {
    try {
      console.log(`Generating alerts for business ${businessId}...`);
      
      const alerts = [];
      
      const products = await Product.findAll({
        where: {
          business_id: businessId,
          is_active: true
        }
      });

      for (const product of products) {
        const lowStockAlert = await this.checkLowStock(product, businessId);
        if (lowStockAlert) alerts.push(lowStockAlert);

        const highWasteAlert = await this.checkHighWaste(product, businessId);
        if (highWasteAlert) alerts.push(highWasteAlert);

        const demandAlert = await this.checkDemandForecast(product, businessId);
        if (demandAlert) alerts.push(demandAlert);

        const expiringAlert = await this.checkExpiringSoon(product, businessId);
        if (expiringAlert) alerts.push(expiringAlert);

        const overstockAlert = await this.checkOverstock(product, businessId);
        if (overstockAlert) alerts.push(overstockAlert);
      }

      if (alerts.length > 0) {
        await Alert.bulkCreate(alerts, {
          ignoreDuplicates: true
        });
      }

      console.log(`Generated ${alerts.length} alerts for business ${businessId}`);
      return alerts;

    } catch (error) {
      console.error('Alert generation error:', error);
      throw error;
    }
  }

  async checkLowStock(product, businessId) {
    try {
      const inventory = await CurrentInventory.findOne({
        where: { product_id: product.id }
      });

      if (!inventory) return null;

      const currentStock = parseFloat(inventory.quantity);
      const reorderLevel = product.reorder_point || 10;

      if (currentStock <= reorderLevel && currentStock > 0) {
        return {
          business_id: businessId,
          product_id: product.id,
          alert_type: 'low_stock',
          message: `${product.name} is running low. Current stock: ${currentStock} units, Reorder level: ${reorderLevel} units`,
          severity: currentStock <= reorderLevel * 0.5 ? 'critical' : 'high',
          status: 'active'
        };
      }

      if (currentStock === 0) {
        return {
          business_id: businessId,
          product_id: product.id,
          alert_type: 'out_of_stock',
          message: `${product.name} is OUT OF STOCK! Immediate action required.`,
          severity: 'critical',
          status: 'active'
        };
      }

      return null;
    } catch (error) {
      console.error(`Low stock check error for product ${product.id}:`, error);
      return null;
    }
  }

  async checkHighWaste(product, businessId) {
    try {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const wasteTransactions = await InventoryTransaction.findAll({
        where: {
          product_id: product.id,
          business_id: businessId,
          transaction_type: 'waste',
          date: {
            [Op.gte]: last7Days
          }
        }
      });

      if (wasteTransactions.length === 0) return null;

      const totalWaste = wasteTransactions.reduce((sum, t) => sum + parseFloat(t.quantity), 0);

      const productionTransactions = await InventoryTransaction.findAll({
        where: {
          product_id: product.id,
          business_id: businessId,
          transaction_type: ['production', 'purchase'],
          date: {
            [Op.gte]: last7Days
          }
        }
      });

      const totalProduction = productionTransactions.reduce((sum, t) => sum + parseFloat(t.quantity), 0);

      if (totalProduction === 0) return null;

      const wastePercentage = (totalWaste / totalProduction) * 100;

      if (wastePercentage > 10) {
        return {
          business_id: businessId,
          product_id: product.id,
          alert_type: 'high_waste',
          message: `${product.name} has high waste rate: ${wastePercentage.toFixed(1)}% (${totalWaste} units wasted in last 7 days). Review production volume.`,
          severity: wastePercentage > 20 ? 'critical' : 'high',
          status: 'active'
        };
      }

      return null;
    } catch (error) {
      console.error(`High waste check error for product ${product.id}:`, error);
      return null;
    }
  }

  async checkDemandForecast(product, businessId) {
    try {
      const forecast = await forecastService.generateForecast(product.id, businessId, 7);

      if (!forecast || !forecast.predicted_demand) return null;

      const inventory = await CurrentInventory.findOne({
        where: { product_id: product.id }
      });

      if (!inventory) return null;

      const currentStock = parseFloat(inventory.quantity);
      const predictedDemand = forecast.predicted_demand;

      if (currentStock < predictedDemand) {
        const shortfall = predictedDemand - currentStock;
        
        return {
          business_id: businessId,
          product_id: product.id,
          alert_type: 'demand_forecast',
          message: `${product.name} may run out of stock! Current: ${currentStock} units, Predicted demand (7 days): ${predictedDemand.toFixed(1)} units. Shortfall: ${shortfall.toFixed(1)} units.`,
          severity: shortfall > predictedDemand * 0.5 ? 'critical' : 'high',
          status: 'active'
        };
      }

      return null;
    } catch (error) {
      console.error(`Demand forecast check error for product ${product.id}:`, error);
      return null;
    }
  }

  async checkExpiringSoon(product, businessId) {
    try {
      if (!product.shelf_life_days || product.shelf_life_days === 0) return null;

      const inventory = await CurrentInventory.findOne({
        where: { product_id: product.id }
      });

      if (!inventory || inventory.quantity === 0) return null;

      const recentProduction = await InventoryTransaction.findOne({
        where: {
          product_id: product.id,
          business_id: businessId,
          transaction_type: 'production'
        },
        order: [['date', 'DESC']]
      });

      if (!recentProduction) return null;

      const productionDate = new Date(recentProduction.date);
      const expiryDate = new Date(productionDate);
      expiryDate.setDate(expiryDate.getDate() + product.shelf_life_days);

      const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 2 && daysUntilExpiry > 0) {
        return {
          business_id: businessId,
          product_id: product.id,
          alert_type: 'expiring_soon',
          message: `${product.name} batch expiring in ${daysUntilExpiry} day(s). Current stock: ${inventory.quantity} units.`,
          severity: daysUntilExpiry === 1 ? 'critical' : 'high',
          status: 'active'
        };
      }

      return null;
    } catch (error) {
      console.error(`Expiring soon check error for product ${product.id}:`, error);
      return null;
    }
  }

  async checkOverstock(product, businessId) {
    try {
      const forecast = await forecastService.generateForecast(product.id, businessId, 7);

      if (!forecast || !forecast.predicted_demand) return null;

      const inventory = await CurrentInventory.findOne({
        where: { product_id: product.id }
      });

      if (!inventory) return null;

      const currentStock = parseFloat(inventory.quantity);
      const predictedDemand = forecast.predicted_demand;

      if (currentStock > predictedDemand * 3 && predictedDemand > 0) {
        const excess = currentStock - predictedDemand;
        
        return {
          business_id: businessId,
          product_id: product.id,
          alert_type: 'overstock',
          message: `${product.name} is overstocked. Current: ${currentStock} units, Predicted demand (7 days): ${predictedDemand.toFixed(1)} units. Excess: ${excess.toFixed(1)} units. Risk of waste.`,
          severity: 'medium',
          status: 'active'
        };
      }

      return null;
    } catch (error) {
      console.error(`Overstock check error for product ${product.id}:`, error);
      return null;
    }
  }
}

module.exports = new AlertGenerationService();