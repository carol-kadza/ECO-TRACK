const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticate = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Inventory routes
router.get('/current', inventoryController.getCurrentInventory);
router.post('/update', inventoryController.updateInventory);
router.get('/transactions', inventoryController.getTransactionHistory);
router.get('/sales', inventoryController.getSalesHistory);

// ADD THIS NEW ROUTE:
router.post('/transaction', inventoryController.createTransaction);

module.exports = router;