const { Alert, Product } = require('../models');
const alertGenerationService = require('../services/alertGenerationService');

// Generate alerts automatically
exports.generateAlerts = async (req, res) => {
  try {
    const businessId = req.user.business_id;

    // Mark old alerts as resolved
    await Alert.update(
      { status: 'resolved' },
      {
        where: {
          business_id: businessId,
          status: 'active'
        }
      }
    );

    // Generate new alerts
    const alerts = await alertGenerationService.generateAlertsForBusiness(businessId);

    res.json({
      message: 'Alerts generated successfully',
      count: alerts.length,
      alerts: alerts
    });
  } catch (error) {
    console.error('Generate alerts error:', error);
    res.status(500).json({
      error: 'Failed to generate alerts',
      details: error.message
    });
  }
};

// Get all alerts
exports.getAlerts = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {
      business_id: req.user.business_id
    };

    if (status) {
      where.status = status;
    } else {
      where.status = 'active';
    }

    const alerts = await Alert.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'category']
      }],
      order: [
        ['severity', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: 50
    });

    res.json({
      count: alerts.length,
      alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      error: 'Failed to get alerts',
      details: error.message
    });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOne({
      where: {
        id,
        business_id: req.user.business_id
      }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await alert.update({ status: 'resolved' });

    res.json({
      message: 'Alert resolved',
      alert
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      error: 'Failed to resolve alert',
      details: error.message
    });
  }
};

// Delete alert
exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Alert.destroy({
      where: {
        id,
        business_id: req.user.business_id
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      message: 'Alert deleted'
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      error: 'Failed to delete alert',
      details: error.message
    });
  }
};