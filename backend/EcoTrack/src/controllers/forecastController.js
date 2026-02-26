const forecastService = require('../services/forecastService');
const { Forecast, Product } = require('../models');
const { Op } = require('sequelize');

// Generate forecast for a product (default 7 days)
exports.generateForecast = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const forecast = await forecastService.generateForecast(product_id, req.user.business_id, 7);
    
    // Save to database
    await forecastService.saveForecast(product_id, req.user.business_id, forecast);
    
    // Get product details
    const product = await Product.findByPk(product_id);
    
    res.json({
      product_id,
      product_name: product.name,
      period: 'weekly',
      days: 7,
      ...forecast
    });
  } catch (error) {
    console.error('Generate forecast error:', error);
    res.status(500).json({ error: 'Failed to generate forecast', details: error.message });
  }
};

// Get weekly forecast (7 days)
exports.getWeeklyForecast = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const forecast = await forecastService.generateForecast(
      product_id, 
      req.user.business_id,
      7
    );
    
    await forecastService.saveForecast(product_id, req.user.business_id, forecast);
    
    const product = await Product.findByPk(product_id);
    
    res.json({
      period: 'weekly',
      days: 7,
      product_id,
      product_name: product?.name,
      ...forecast
    });
  } catch (error) {
    console.error('Weekly forecast error:', error);
    res.status(500).json({ 
      error: 'Failed to generate weekly forecast', 
      details: error.message 
    });
  }
};

// Get monthly forecast (30 days)
exports.getMonthlyForecast = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const forecast = await forecastService.generateForecast(
      product_id, 
      req.user.business_id,
      30
    );
    
    await forecastService.saveForecast(product_id, req.user.business_id, forecast);
    
    const product = await Product.findByPk(product_id);
    
    res.json({
      period: 'monthly',
      days: 30,
      product_id,
      product_name: product?.name,
      ...forecast
    });
  } catch (error) {
    console.error('Monthly forecast error:', error);
    res.status(500).json({ 
      error: 'Failed to generate monthly forecast', 
      details: error.message 
    });
  }
};

// Get all forecasts
exports.getAllForecasts = async (req, res) => {
  try {
    const forecasts = await forecastService.getAllForecasts(req.user.business_id);
    
    res.json({
      count: forecasts.length,
      forecasts
    });
  } catch (error) {
    console.error('Get forecasts error:', error);
    res.status(500).json({ error: 'Failed to get forecasts', details: error.message });
  }
};

// Get forecast history
exports.getForecastHistory = async (req, res) => {
  try {
    const { product_id, start_date, end_date } = req.query;
    
    const where = {
      business_id: req.user.business_id
    };
    
    if (product_id) where.product_id = product_id;
    if (start_date && end_date) {
      where.forecast_date = {
        [Op.between]: [start_date, end_date]
      };
    }
    
    const forecasts = await Forecast.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'category']
      }],
      order: [['forecast_date', 'DESC']],
      limit: 100
    });
    
    res.json({
      count: forecasts.length,
      forecasts
    });
  } catch (error) {
    console.error('Get forecast history error:', error);
    res.status(500).json({ error: 'Failed to get forecast history', details: error.message });
  }
};

// Generate waste forecast for a product
exports.generateWasteForecast = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { days_ahead = 7 } = req.body;
    
    const wasteForecast = await forecastService.generateWasteForecast(
      product_id, 
      req.user.business_id,
      days_ahead
    );
    
    if (!wasteForecast.success) {
      return res.status(400).json(wasteForecast);
    }
    
    const product = await Product.findByPk(product_id);
    
    res.json({
      product_name: product?.name,
      ...wasteForecast
    });
  } catch (error) {
    console.error('Generate waste forecast error:', error);
    res.status(500).json({ 
      error: 'Failed to generate waste forecast', 
      details: error.message 
    });
  }
};

// Generate stock recommendation for a product
exports.generateStockRecommendation = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const recommendation = await forecastService.generateStockRecommendation(
      product_id,
      req.user.business_id
    );
    
    if (!recommendation.success) {
      return res.status(400).json(recommendation);
    }
    
    const product = await Product.findByPk(product_id);
    
    res.json({
      product_name: product?.name,
      product_sku: product?.sku,
      ...recommendation
    });
  } catch (error) {
    console.error('Generate stock recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate stock recommendation', 
      details: error.message 
    });
  }
};