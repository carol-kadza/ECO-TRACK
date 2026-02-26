const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);


router.get('/', settingsController.getUserSettings);


router.put('/profile', settingsController.updateUserProfile);


router.put('/business', settingsController.updateBusinessSettings);


router.post('/change-password', settingsController.changePassword);


router.get('/notifications', settingsController.getNotificationPreferences);
router.put('/notifications', settingsController.updateNotificationPreferences);

module.exports = router;