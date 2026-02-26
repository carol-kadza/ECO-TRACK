const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const authenticate = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);


router.get('/', forecastController.getAllForecasts);
router.get('/:product_id', forecastController.generateForecast);
router.get('/history/all', forecastController.getForecastHistory);
router.get('/weekly/:product_id', forecastController.getWeeklyForecast);
router.get('/monthly/:product_id', forecastController.getMonthlyForecast);


router.post('/waste/:product_id', forecastController.generateWasteForecast);
router.post('/stock-recommendation/:product_id', forecastController.generateStockRecommendation);

module.exports = router;