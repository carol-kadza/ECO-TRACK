const { Sale, Product, Forecast, InventoryTransaction } = require('../models');
const { Op } = require('sequelize');

/**
 * Calculate simple moving average
 */
const calculateMovingAverage = (data, period = 7) => {
  if (data.length < period) return null;
  const sum = data.slice(-period).reduce((acc, val) => acc + val, 0);
  return sum / period;
};

/**
 * Calculate linear regression for trend analysis
 */
const linearRegression = (dataPoints) => {
  const n = dataPoints.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  dataPoints.forEach((point, index) => {
    const x = index;
    const y = point;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

/**
 * Predict future values using linear regression
 */
const predictLinear = (dataPoints, daysAhead = 7) => {
  const regression = linearRegression(dataPoints);
  if (!regression) return null;

  const predictions = [];
  const startIndex = dataPoints.length;

  for (let i = 0; i < daysAhead; i++) {
    const x = startIndex + i;
    const y = regression.slope * x + regression.intercept;
    predictions.push(Math.max(0, y)); // Ensure non-negative
  }

  return predictions;
};

/**
 * Calculate variance
 */
const calculateVariance = (data) => {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
};

/**
 * Calculate confidence score (0-100)
 */
const calculateConfidence = (variance, dataPoints) => {
  const dataScore = Math.min(dataPoints / 30, 1) * 50;
  const varianceScore = Math.max(0, 50 - variance * 2);
  return Math.min(100, Math.round(dataScore + varianceScore));
};

/**
 * Get future date
 */
const getFutureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

/**
 * Get historical sales data
 */
const getHistoricalSales = async (productId, businessId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Try InventoryTransaction first (your new structure)
  try {
    const transactions = await InventoryTransaction.findAll({
      where: {
        product_id: productId,
        business_id: businessId,
        transaction_type: 'sale',
        date: {
          [Op.gte]: startDate
        }
      },
      order: [['date', 'ASC']],
      attributes: ['date', 'quantity']
    });

    if (transactions.length > 0) {
      return transactions.map(t => ({
        date: t.date,
        quantity: parseFloat(t.quantity)
      }));
    }
  } catch (error) {
    console.log('InventoryTransaction not available, trying Sale model...');
  }

  // Fallback to Sale model (your old structure)
  try {
    const sales = await Sale.findAll({
      where: {
        product_id: productId,
        business_id: businessId,
        date: {
          [Op.gte]: startDate
        }
      },
      order: [['date', 'ASC']]
    });

    return sales.map(s => ({
      date: s.date,
      quantity: parseFloat(s.quantity_sold || s.quantity)
    }));
  } catch (error) {
    console.log('Sale model not available');
    return [];
  }
};

/**
 * Generate advanced forecast
 */
exports.generateForecast = async (productId, businessId, daysAhead = 7) => {
  try {
    // Get product
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Get historical sales data
    const salesHistory = await getHistoricalSales(productId, businessId, 30);
    
    if (salesHistory.length === 0) {
      // No sales history - use default
      return {
        predicted_demand: 10,
        confidence_level: 'low',
        confidence_score: 20,
        reasoning: 'No sales history available. Using default estimate.',
        recommended_stock: 15,
        forecast_method: 'default',
        trend: 'unknown',
        predictions: []
      };
    }

    if (salesHistory.length < 7) {
      // Limited data - use simple average
      const totalSold = salesHistory.reduce((sum, sale) => sum + sale.quantity, 0);
      const avgDailySales = Math.ceil(totalSold / salesHistory.length);
      
      return {
        predicted_demand: avgDailySales * daysAhead,
        confidence_level: 'low',
        confidence_score: 30,
        reasoning: `Limited data (${salesHistory.length} days). Using simple average.`,
        recommended_stock: Math.ceil(avgDailySales * daysAhead * 1.2),
        forecast_method: 'simple_average',
        trend: 'insufficient_data',
        average_daily_sales: avgDailySales,
        predictions: []
      };
    }
    
    // Extract quantities for advanced analysis
    const quantities = salesHistory.map(s => s.quantity);
    
    // Calculate metrics
    const avgDailySales = quantities.reduce((a, b) => a + b, 0) / quantities.length;
    const movingAvg7 = calculateMovingAverage(quantities, 7);
    const predictions = predictLinear(quantities, daysAhead);
    
    // Calculate trend
    const regression = linearRegression(quantities);
    const trend = regression.slope > 0.5 ? 'increasing' : 
                  regression.slope < -0.5 ? 'decreasing' : 'stable';
    
    // Calculate confidence based on data consistency
    const variance = calculateVariance(quantities);
    const confidenceScore = calculateConfidence(variance, quantities.length);
    
    let confidenceLevel = 'low';
    if (confidenceScore >= 70) confidenceLevel = 'high';
    else if (confidenceScore >= 50) confidenceLevel = 'medium';
    
    // Calculate total predicted demand
    const totalPredictedDemand = predictions ? 
      predictions.reduce((a, b) => a + b, 0) : avgDailySales * daysAhead;
    
    // Add safety buffer (20%)
    const recommendedStock = Math.ceil(totalPredictedDemand * 1.2);
    
    // Format predictions with dates
    const formattedPredictions = predictions ? predictions.map((qty, index) => ({
      day: index + 1,
      predicted_quantity: parseFloat(qty.toFixed(2)),
      date: getFutureDate(index + 1)
    })) : [];
    
    return {
      predicted_demand: parseFloat(totalPredictedDemand.toFixed(2)),
      confidence_level: confidenceLevel,
      confidence_score: confidenceScore,
      reasoning: `Based on ${salesHistory.length} days of sales data. Average: ${avgDailySales.toFixed(2)} units/day. Trend: ${trend}. Moving avg (7-day): ${movingAvg7?.toFixed(2) || 'N/A'}.`,
      recommended_stock: recommendedStock,
      forecast_method: 'linear_regression',
      trend: trend,
      average_daily_sales: parseFloat(avgDailySales.toFixed(2)),
      moving_average_7day: parseFloat(movingAvg7?.toFixed(2) || 0),
      predictions: formattedPredictions,
      forecast_period_days: daysAhead
    };
  } catch (error) {
    console.error('Forecast generation error:', error);
    throw error;
  }
};

/**
 * Save forecast to database
 */
exports.saveForecast = async (productId, businessId, forecastData) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const forecast = await Forecast.create({
      product_id: productId,
      business_id: businessId,
      forecast_date: tomorrow,
      predicted_demand: forecastData.predicted_demand,
      recommended_stock: forecastData.recommended_stock,
      confidence_level: forecastData.confidence_level,
      reasoning: forecastData.reasoning,
      forecast_method: forecastData.forecast_method
    });
    
    return forecast;
  } catch (error) {
    console.error('Save forecast error:', error);
    throw error;
  }
};

/**
 * Get forecasts for all products
 */
exports.getAllForecasts = async (businessId) => {
  try {
    const products = await Product.findAll({
      where: { 
        business_id: businessId,
        is_active: true
      }
    });
    
    const forecasts = [];
    
    for (const product of products) {
      try {
        const forecastData = await this.generateForecast(product.id, businessId);
        forecasts.push({
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          category: product.category,
          current_stock: product.current_stock,
          ...forecastData
        });
      } catch (error) {
        console.error(`Error forecasting product ${product.id}:`, error);
        // Continue with other products
      }
    }
    
    return forecasts;
  } catch (error) {
    console.error('Get all forecasts error:', error);
    throw error;
  }
};

/**
 * Generate waste forecast
 */
exports.generateWasteForecast = async (productId, businessId, daysAhead = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const wasteTransactions = await InventoryTransaction.findAll({
      where: {
        product_id: productId,
        business_id: businessId,
        transaction_type: 'waste',
        date: {
          [Op.gte]: startDate
        }
      },
      order: [['date', 'ASC']],
      attributes: ['date', 'quantity']
    });

    if (wasteTransactions.length < 3) {
      return {
        success: false,
        message: 'Insufficient waste data for forecasting'
      };
    }

    const quantities = wasteTransactions.map(t => parseFloat(t.quantity));
    const avgDailyWaste = quantities.reduce((a, b) => a + b, 0) / quantities.length;
    const predictions = predictLinear(quantities, daysAhead);

    return {
      success: true,
      product_id: productId,
      forecast_period_days: daysAhead,
      average_daily_waste: parseFloat(avgDailyWaste.toFixed(2)),
      predictions: predictions.map((qty, index) => ({
        day: index + 1,
        predicted_waste: parseFloat(qty.toFixed(2)),
        date: getFutureDate(index + 1)
      })),
      total_predicted_waste: parseFloat(predictions.reduce((a, b) => a + b, 0).toFixed(2))
    };
  } catch (error) {
    console.error('Waste forecast error:', error);
    return {
      success: false,
      message: 'Error generating waste forecast',
      error: error.message
    };
  }
};

/**
 * Generate stock recommendation
 */
exports.generateStockRecommendation = async (productId, businessId) => {
  try {
    const demandForecast = await this.generateForecast(productId, businessId, 7);
    const wasteForecast = await this.generateWasteForecast(productId, businessId, 7);

    const predictedDemand = demandForecast.predicted_demand || 0;
    const predictedWaste = wasteForecast.success ? wasteForecast.total_predicted_waste : 0;
    
    // Add safety stock (20% buffer)
    const safetyStock = predictedDemand * 0.2;
    const recommendedStock = predictedDemand + safetyStock;

    // Get current stock
    const { CurrentInventory } = require('../models');

    const inventory = await CurrentInventory.findOne({
      where: { product_id: productId }
    });

    const currentStock = inventory ? parseFloat(inventory.quantity) : 0;
    const stockGap = recommendedStock - currentStock;

    return {
      success: true,
      product_id: productId,
      current_stock: currentStock,
      recommended_stock: parseFloat(recommendedStock.toFixed(2)),
      stock_gap: parseFloat(stockGap.toFixed(2)),
      action: stockGap > 0 ? 'increase_stock' : stockGap < 0 ? 'reduce_stock' : 'maintain',
      forecast_summary: {
        predicted_demand_7days: predictedDemand,
        predicted_waste_7days: predictedWaste,
        safety_stock: parseFloat(safetyStock.toFixed(2))
      }
    };
  } catch (error) {
    console.error('Stock recommendation error:', error);
    return {
      success: false,
      message: 'Error generating stock recommendation',
      error: error.message
    };
  }
};