const { User, Business } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const twoFactorAuthService = require('../services/twoFactorAuthService');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, business_id: user.business_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { 
      business_name, 
      business_type, 
      business_email,
      user_name, 
      user_email, 
      password 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: user_email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create business
    const business = await Business.create({
      name: business_name,
      type: business_type || 'grocery',
      email: business_email,
      timezone: 'UTC',
      subscription_plan: 'free',
      is_active: true
    });
    
    // Create user
    const user = await User.create({
      business_id: business.id,
      name: user_name,
      email: user_email,
      password: password,
      role: 'owner',
      is_active: true
    });
    
    // Generate token
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business_id: user.business_id
      },
      business: {
        id: business.id,
        name: business.name,
        type: business.type
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed', details: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, two_factor_token, backup_code } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password']
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [{
        model: Business,
        as: 'business'
      }]
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      if (!two_factor_token && !backup_code) {
        return res.status(200).json({
          requires_2fa: true,
          user_id: user.id,
          message: 'Please enter your 6-digit code from your authenticator app',
          supports_backup_code: true
        });
      }

      let isValid = false;

      if (backup_code) {
        const backupCodes = JSON.parse(user.two_factor_backup_codes || '[]');
        
        for (let i = 0; i < backupCodes.length; i++) {
          if (twoFactorAuthService.verifyBackupCode(backup_code, backupCodes[i])) {
            isValid = true;
            backupCodes.splice(i, 1);
            await user.update({
              two_factor_backup_codes: JSON.stringify(backupCodes)
            });
            break;
          }
        }
      } else if (two_factor_token) {
        isValid = twoFactorAuthService.verifyToken(
          user.two_factor_secret,
          two_factor_token
        );
      }

      if (!isValid) {
        return res.status(401).json({
          error: 'Invalid 2FA code',
          message: 'The verification code is incorrect. Please try again.'
        });
      }
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        business_id: user.business_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        business_id: user.business_id,
        two_factor_enabled: user.two_factor_enabled
      },
      business: user.business ? {
        id: user.business.id,
        name: user.business.name,
        type: user.business.type
      } : null,
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error.message
    });
  }
};

// Get current user profile
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'business_id', 'two_factor_enabled'],
      include: [{
        model: Business,
        as: 'business',
        attributes: ['id', 'name', 'type', 'email']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business_id: user.business_id,
        two_factor_enabled: user.two_factor_enabled
      },
      business: user.business
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      details: error.message
    });
  }
};