const { 
  Product, 
  CurrentInventory, 
  Sale, 
  Alert,
  InventoryTransaction 
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const forecastService = require('../services/forecastService');
const alertService = require('../services/alertService');

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const businessId = req.user.business_id;
    
    // Get total products
    const totalProducts = await Product.count({
      where: { 
        business_id: businessId,
        is_active: true
      }
    });
    
    // Get current inventory value
    const inventory = await CurrentInventory.findAll({
      where: { business_id: businessId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['selling_price']
      }]
    });
    
    const totalInventoryValue = inventory.reduce((sum, item) => {
      return sum + (item.quantity * parseFloat(item.product.selling_price));
    }, 0);
    
    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = await Sale.findAll({
      where: {
        business_id: businessId,
        date: {
          [Op.gte]: today
        }
      }
    });
    
    const todayRevenue = todaySales.reduce((sum, sale) => {
      return sum + parseFloat(sale.total_revenue || 0);
    }, 0);
    
    const todayUnitsSold = todaySales.reduce((sum, sale) => {
      return sum + sale.quantity_sold;
    }, 0);
    
    // Get this week's waste
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekWaste = await InventoryTransaction.findAll({
      where: {
        business_id: businessId,
        transaction_type: 'waste',
        date: {
          [Op.gte]: weekAgo
        }
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['production_cost']
      }]
    });
    
    const weekWasteValue = weekWaste.reduce((sum, transaction) => {
      return sum + (transaction.quantity * parseFloat(transaction.product.production_cost));
    }, 0);
    
    const weekWasteUnits = weekWaste.reduce((sum, transaction) => {
      return sum + transaction.quantity;
    }, 0);
    
    const totalWaste = weekWasteUnits;
    
    // Get active alerts count
    const activeAlerts = await Alert.count({
      where: {
        business_id: businessId,
        status: 'active'
      }
    });
    
    // Get critical alerts
    const criticalAlerts = await Alert.count({
      where: {
        business_id: businessId,
        status: 'active',
        severity: 'critical'
      }
    });
    
    // Get low stock items
    const lowStockItems = await CurrentInventory.findAll({
      where: { business_id: businessId },
      include: [{
        model: Product,
        as: 'product',
        where: {
          is_active: true
        }
      }]
    });
    
    const lowStockCount = lowStockItems.filter(item => 
      item.quantity <= (item.product.reorder_point || 10)
    ).length;
    
    // Get top 5 wasted products
    const topWasteItems = await InventoryTransaction.findAll({
      where: {
        business_id: businessId,
        transaction_type: 'waste',
        date: {
          [Op.gte]: weekAgo
        }
      },
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_waste']
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name']
      }],
      group: ['product_id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 5,
      raw: true
    });
    
    res.json({
      summary: {
        total_products: totalProducts,
        total_inventory_value: parseFloat(totalInventoryValue.toFixed(2)),
        today_revenue: parseFloat(todayRevenue.toFixed(2)),
        today_units_sold: todayUnitsSold,
        week_waste_value: parseFloat(weekWasteValue.toFixed(2)),
        week_waste_units: weekWasteUnits,
        active_alerts: activeAlerts,
        critical_alerts: criticalAlerts,
        low_stock_items: lowStockCount
      },
      top_waste_items: topWasteItems.map(item => ({
        product_name: item['product.name'],
        waste_quantity: parseFloat(item.total_waste),
        percentage: totalWaste > 0 ? ((parseFloat(item.total_waste) / totalWaste) * 100).toFixed(1) : 0
      }))
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({ error: 'Failed to get dashboard summary', details: error.message });
  }
};

// Get dashboard with forecasts and alerts
exports.getFullDashboard = async (req, res) => {
  try {
    const businessId = req.user.business_id;
    
    // Get forecasts
    const forecasts = await forecastService.getAllForecasts(businessId);
    
    // Get alerts
    const alerts = await alertService.getActiveAlerts(businessId);
    
    // Get low stock products
    const lowStock = await CurrentInventory.findAll({
      where: { business_id: businessId },
      include: [{
        model: Product,
        as: 'product',
        where: { is_active: true }
      }]
    });
    
    const lowStockProducts = lowStock
      .filter(item => item.quantity <= (item.product.reorder_point || 10))
      .map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        current_stock: item.quantity,
        reorder_point: item.product.reorder_point
      }));
    
    res.json({
      forecasts: forecasts.slice(0, 5),
      alerts: alerts.slice(0, 10),
      low_stock_products: lowStockProducts
    });
  } catch (error) {
    console.error('Get full dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard', details: error.message });
  }
};