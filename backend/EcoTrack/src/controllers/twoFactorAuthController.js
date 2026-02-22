const twoFactorAuthService = require('../services/twoFactorAuthService');
const { User } = require('../models');

/**
 * Setup 2FA - Generate secret and QR code
 */
exports.setup2FA = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if 2FA is already enabled
    if (user.two_factor_enabled) {
      return res.status(400).json({
        error: '2FA is already enabled',
        message: 'Disable 2FA first before setting up again'
      });
    }

    // Generate new secret
    const { secret, otpauth_url } = twoFactorAuthService.generateSecret(
      user.email,
      'EcoTrack'
    );

    // Generate QR code
    const qrCode = await twoFactorAuthService.generateQRCode(otpauth_url);

    // Store secret temporarily (not enabled yet)
    await user.update({
      two_factor_secret: secret,
      two_factor_enabled: false
    });

    res.json({
      message: '2FA setup initiated',
      secret: secret,
      qrCode: qrCode,
      instructions: [
        '1. Install Google Authenticator or Authy on your phone',
        '2. Scan the QR code with the app',
        '3. Enter the 6-digit code from the app to verify and enable 2FA'
      ]
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({
      error: 'Failed to setup 2FA',
      details: error.message
    });
  }
};

/**
 * Verify and enable 2FA
 */
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Missing required field',
        required: ['token']
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user || !user.two_factor_secret) {
      return res.status(400).json({
        error: 'No 2FA setup found',
        message: 'Please setup 2FA first'
      });
    }

    if (user.two_factor_enabled) {
      return res.status(400).json({
        error: '2FA already enabled'
      });
    }

    // Verify token
    const isValid = twoFactorAuthService.verifyToken(
      user.two_factor_secret,
      token
    );

    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid verification code',
        message: 'Please check the code and try again'
      });
    }

    // Generate backup codes
    const backupCodes = twoFactorAuthService.generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map(code =>
      twoFactorAuthService.hashBackupCode(code)
    );

    // Enable 2FA
    await user.update({
      two_factor_enabled: true,
      two_factor_backup_codes: JSON.stringify(hashedBackupCodes)
    });

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes,
      warning: 'Save these backup codes in a safe place. You will need them if you lose access to your authenticator app.'
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      error: 'Failed to verify 2FA',
      details: error.message
    });
  }
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Password required to disable 2FA'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.two_factor_enabled) {
      return res.status(400).json({
        error: '2FA is not enabled'
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // If token provided, verify it
    if (token) {
      const isTokenValid = twoFactorAuthService.verifyToken(
        user.two_factor_secret,
        token
      );

      if (!isTokenValid) {
        return res.status(400).json({
          error: 'Invalid 2FA code'
        });
      }
    }

    // Disable 2FA
    await user.update({
      two_factor_enabled: false,
      two_factor_secret: null,
      two_factor_backup_codes: null
    });

    res.json({
      message: '2FA disabled successfully'
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({
      error: 'Failed to disable 2FA',
      details: error.message
    });
  }
};

/**
 * Get 2FA status
 */
exports.get2FAStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'two_factor_enabled', 'two_factor_backup_codes']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let backupCodesCount = 0;
    if (user.two_factor_enabled && user.two_factor_backup_codes) {
      const codes = JSON.parse(user.two_factor_backup_codes);
      backupCodesCount = codes.length;
    }

    res.json({
      two_factor_enabled: user.two_factor_enabled,
      backup_codes_remaining: backupCodesCount
    });
  } catch (error) {
    console.error('Get 2FA status error:', error);
    res.status(500).json({
      error: 'Failed to get 2FA status',
      details: error.message
    });
  }
};

/**
 * Regenerate backup codes
 */
exports.regenerateBackupCodes = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'TOTP token required to regenerate backup codes'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user || !user.two_factor_enabled) {
      return res.status(400).json({
        error: '2FA is not enabled'
      });
    }

    // Verify token
    const isValid = twoFactorAuthService.verifyToken(
      user.two_factor_secret,
      token
    );

    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid verification code'
      });
    }

    // Generate new backup codes
    const backupCodes = twoFactorAuthService.generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map(code =>
      twoFactorAuthService.hashBackupCode(code)
    );

    await user.update({
      two_factor_backup_codes: JSON.stringify(hashedBackupCodes)
    });

    res.json({
      message: 'Backup codes regenerated successfully',
      backupCodes: backupCodes,
      warning: 'Your old backup codes are now invalid. Save these new codes in a safe place.'
    });
  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({
      error: 'Failed to regenerate backup codes',
      details: error.message
    });
  }
};