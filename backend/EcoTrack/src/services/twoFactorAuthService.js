const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

class TwoFactorAuthService {
  /**
   * Generate a new 2FA secret for a user
   */
  generateSecret(userEmail, businessName = 'EcoTrack') {
    const secret = speakeasy.generateSecret({
      name: `${businessName} (${userEmail})`,
      issuer: 'EcoTrack',
      length: 32
    });

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url
    };
  }

  /**
   * Generate QR code from secret
   */
  async generateQRCode(otpauth_url) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauth_url);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('QR Code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify TOTP token
   */
  verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps before/after for clock drift
    });
  }

  /**
   * Generate backup codes for account recovery
   */
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup code for storage
   */
  hashBackupCode(code) {
    return crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(code, hashedCode) {
    const hash = this.hashBackupCode(code);
    return hash === hashedCode;
  }

  /**
   * Generate current TOTP (for testing)
   */
  getCurrentToken(secret) {
    return speakeasy.totp({
      secret: secret,
      encoding: 'base32'
    });
  }
}

module.exports = new TwoFactorAuthService();