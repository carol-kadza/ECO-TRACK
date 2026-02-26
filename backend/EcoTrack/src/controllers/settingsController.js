const { User, Business } = require('../models');
const bcrypt = require('bcryptjs');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'two_factor_enabled'],
      include: [{
        model: Business,
        as: 'business',
        attributes: ['id', 'name', 'type', 'email', 'phone', 'timezone']
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
        two_factor_enabled: user.two_factor_enabled
      },
      business: user.business
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      error: 'Failed to get settings',
      details: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        error: 'At least one field is required',
        fields: ['name', 'email']
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'Email already in use'
        });
      }
    }

    // Update user
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    await user.update(updates);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      details: error.message
    });
  }
};

// Update business settings
exports.updateBusinessSettings = async (req, res) => {
  try {
    const { name, type, email, phone, timezone } = req.body;

    const business = await Business.findByPk(req.user.business_id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Build updates object
    const updates = {};
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (timezone) updates.timezone = timezone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'At least one field is required'
      });
    }

    await business.update(updates);

    res.json({
      message: 'Business settings updated successfully',
      business: {
        id: business.id,
        name: business.name,
        type: business.type,
        email: business.email,
        phone: business.phone,
        timezone: business.timezone
      }
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({
      error: 'Failed to update business settings',
      details: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    // Validate required fields
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        error: 'All fields are required',
        required: ['current_password', 'new_password', 'confirm_password']
      });
    }

    // Check if new passwords match
    if (new_password !== confirm_password) {
      return res.status(400).json({
        error: 'New passwords do not match'
      });
    }

    // Check password strength
    if (new_password.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update password
    await user.update({ password: hashedPassword });

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Failed to change password',
      details: error.message
    });
  }
};

// Get notification preferences (placeholder for future)
exports.getNotificationPreferences = async (req, res) => {
  try {
    // For now, return default preferences
    // Later you can add a separate notifications table
    res.json({
      email_notifications: true,
      alert_notifications: true,
      low_stock_threshold: 10,
      high_waste_threshold: 15,
      notification_frequency: 'daily'
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Failed to get notification preferences',
      details: error.message
    });
  }
};

// Update notification preferences (placeholder for future)
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const {
      email_notifications,
      alert_notifications,
      low_stock_threshold,
      high_waste_threshold,
      notification_frequency
    } = req.body;

    // For now, just return success
    // Later you can save these to a notifications table
    res.json({
      message: 'Notification preferences updated successfully',
      preferences: {
        email_notifications,
        alert_notifications,
        low_stock_threshold,
        high_waste_threshold,
        notification_frequency
      }
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      error: 'Failed to update notification preferences',
      details: error.message
    });
  }
};