const express = require('express');
const router = express.Router();
const twoFactorAuthController = require('../controllers/twoFactorAuthController');
const authenticate = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Setup 2FA - Get QR code
router.post('/setup', twoFactorAuthController.setup2FA);

// Verify and enable 2FA
router.post('/verify', twoFactorAuthController.verify2FA);

// Disable 2FA
router.post('/disable', twoFactorAuthController.disable2FA);

// Get 2FA status
router.get('/status', twoFactorAuthController.get2FAStatus);

// Regenerate backup codes
router.post('/regenerate-backup-codes', twoFactorAuthController.regenerateBackupCodes);

module.exports = router;