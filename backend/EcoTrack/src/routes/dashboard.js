const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Dashboard routes
router.get('/summary', dashboardController.getDashboardSummary);
router.get('/full', dashboardController.getFullDashboard);

module.exports = router;