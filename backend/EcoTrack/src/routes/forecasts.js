const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const authenticate = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Existing forecast routes
router.get('/', forecastController.getAllForecasts);
router.get('/:product_id', forecastController.generateForecast);
router.get('/history/all', forecastController.getForecastHistory);

// NEW: Advanced forecasting routes
router.post('/waste/:product_id', forecastController.generateWasteForecast);
router.post('/stock-recommendation/:product_id', forecastController.generateStockRecommendation);

module.exports = router;