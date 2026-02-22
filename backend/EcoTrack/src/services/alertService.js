const { Alert, Product, CurrentInventory, Forecast } = require('../models');
const { Op } = require('sequelize');
const forecastService = require('./forecastService');

// Check for surplus alerts
exports.checkSurplusAlerts = async (businessId) => {
  try {
    const products = await Product.findAll({
      where: { 
        business_id: businessId,
        is_active: true,
        is_perishable: true
      },
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }]
    });
    
    const alerts = [];
    
    for (const product of products) {
      if (!product.current_inventory) continue;
      
      const currentStock = product.current_inventory.quantity;
      
      // Get forecast
      const forecast = await forecastService.generateForecast(product.id, businessId);
      const predictedDemand = forecast.predicted_demand;
      
      // Check if surplus (stock > predicted * 1.5)
      if (currentStock > predictedDemand * 1.5) {
        const surplus = currentStock - predictedDemand;
        const valueAtRisk = surplus * product.selling_price;
        
        // Check if alert already exists
        const existingAlert = await Alert.findOne({
          where: {
            product_id: product.id,
            alert_type: 'surplus',
            status: 'active'
          }
        });
        
        if (!existingAlert) {
          const alert = await Alert.create({
            product_id: product.id,
            business_id: businessId,
            alert_type: 'surplus',
            severity: surplus > predictedDemand * 2 ? 'urgent' : 'warning',
            message: `${product.name}: ${surplus} units surplus. Current stock (${currentStock}) exceeds forecast (${predictedDemand}).`,
            recommended_action: `Consider: 1) Offering 20% discount, 2) Creating bundle deals, 3) Reducing next production batch`,
            quantity_at_risk: surplus,
            value_at_risk: valueAtRisk,
            status: 'active',
            is_read: false
          });
          
          alerts.push(alert);
        }
      }
    }
    
    return alerts;
  } catch (error) {
    console.error('Check surplus alerts error:', error);
    throw error;
  }
};

// Check for expiry alerts
exports.checkExpiryAlerts = async (businessId) => {
  try {
    const products = await Product.findAll({
      where: { 
        business_id: businessId,
        is_active: true,
        is_perishable: true,
        shelf_life_days: {
          [Op.lte]: 7
        }
      },
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }]
    });
    
    const alerts = [];
    
    for (const product of products) {
      if (!product.current_inventory || product.current_inventory.quantity === 0) continue;
      
      const currentStock = product.current_inventory.quantity;
      const shelfLife = product.shelf_life_days;
      
      // Get forecast for next few days
      const forecast = await forecastService.generateForecast(product.id, businessId);
      const expectedSales = forecast.predicted_demand * shelfLife;
      
      // Check if items will expire
      if (currentStock > expectedSales) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        
        const atRisk = currentStock - expectedSales;
        const valueAtRisk = atRisk * product.selling_price;
        
        const existingAlert = await Alert.findOne({
          where: {
            product_id: product.id,
            alert_type: 'expiry',
            status: 'active'
          }
        });
        
        if (!existingAlert) {
          const alert = await Alert.create({
            product_id: product.id,
            business_id: businessId,
            alert_type: 'expiry',
            severity: shelfLife <= 2 ? 'critical' : shelfLife <= 4 ? 'urgent' : 'warning',
            message: `${product.name}: ${atRisk} units may expire in ${shelfLife} days. Expected to sell only ${expectedSales} units.`,
            recommended_action: `Immediate action needed: 1) Heavy discount (30-50%), 2) Flash sale, 3) Donation to food bank`,
            quantity_at_risk: atRisk,
            value_at_risk: valueAtRisk,
            expiry_date: expiryDate,
            status: 'active',
            is_read: false
          });
          
          alerts.push(alert);
        }
      }
    }
    
    return alerts;
  } catch (error) {
    console.error('Check expiry alerts error:', error);
    throw error;
  }
};

// Check for low stock alerts
exports.checkLowStockAlerts = async (businessId) => {
  try {
    const products = await Product.findAll({
      where: { 
        business_id: businessId,
        is_active: true
      },
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }]
    });
    
    const alerts = [];
    
    for (const product of products) {
      if (!product.current_inventory) continue;
      
      const currentStock = product.current_inventory.quantity;
      const reorderPoint = product.reorder_point || 10;
      
      if (currentStock <= reorderPoint) {
        const existingAlert = await Alert.findOne({
          where: {
            product_id: product.id,
            alert_type: 'low_stock',
            status: 'active'
          }
        });
        
        if (!existingAlert) {
          const alert = await Alert.create({
            product_id: product.id,
            business_id: businessId,
            alert_type: 'low_stock',
            severity: currentStock === 0 ? 'critical' : currentStock <= reorderPoint * 0.5 ? 'urgent' : 'info',
            message: `${product.name}: Low stock (${currentStock} units). Reorder point: ${reorderPoint} units.`,
            recommended_action: `Restock immediately to avoid stockouts. Recommended order: ${reorderPoint * 2} units.`,
            quantity_at_risk: reorderPoint - currentStock,
            status: 'active',
            is_read: false
          });
          
          alerts.push(alert);
        }
      }
    }
    
    return alerts;
  } catch (error) {
    console.error('Check low stock alerts error:', error);
    throw error;
  }
};

// Run all alert checks
exports.checkAllAlerts = async (businessId) => {
  try {
    const surplusAlerts = await this.checkSurplusAlerts(businessId);
    const expiryAlerts = await this.checkExpiryAlerts(businessId);
    const lowStockAlerts = await this.checkLowStockAlerts(businessId);
    
    return {
      surplus: surplusAlerts,
      expiry: expiryAlerts,
      low_stock: lowStockAlerts,
      total: surplusAlerts.length + expiryAlerts.length + lowStockAlerts.length
    };
  } catch (error) {
    console.error('Check all alerts error:', error);
    throw error;
  }
};

// Get active alerts
exports.getActiveAlerts = async (businessId) => {
  try {
    const alerts = await Alert.findAll({
      where: {
        business_id: businessId,
        status: 'active'
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'category', 'unit']
      }],
      order: [
        ['severity', 'DESC'],
        ['created_at', 'DESC']
      ]
    });
    
    return alerts;
  } catch (error) {
    console.error('Get active alerts error:', error);
    throw error;
  }
};