const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', alertController.getAlerts);
router.post('/generate', alertController.generateAlerts);
router.put('/:id/resolve', alertController.resolveAlert);
router.delete('/:id', alertController.deleteAlert);

module.exports = router;