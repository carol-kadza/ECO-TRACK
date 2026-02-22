const { 
  CurrentInventory, 
  InventoryTransaction, 
  Product, 
  Sale 
} = require('../models');
const { Op } = require('sequelize');

// Get current inventory for all products
exports.getCurrentInventory = async (req, res) => {
  try {
    const inventory = await CurrentInventory.findAll({
      where: { business_id: req.user.business_id },
      include: [{
        model: Product,
        as: 'product',
        where: { is_active: true }
      }],
      order: [[{ model: Product, as: 'product' }, 'name', 'ASC']]
    });
    
    res.json({
      count: inventory.length,
      inventory
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Failed to get inventory', details: error.message });
  }
};

// Update inventory (daily update)
exports.updateInventory = async (req, res) => {
  try {
    const {
      product_id,
      quantity_sold,
      quantity_produced,
      quantity_wasted,
      closing_stock,
      notes
    } = req.body;
    
    // Get product
    const product = await Product.findOne({
      where: { 
        id: product_id,
        business_id: req.user.business_id
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get current inventory
    const currentInventory = await CurrentInventory.findOne({
      where: { product_id }
    });
    
    const opening_stock = currentInventory ? currentInventory.quantity : 0;
    
    // Record sales transaction if any
    if (quantity_sold && quantity_sold > 0) {
      await InventoryTransaction.create({
        product_id,
        business_id: req.user.business_id,
        date: new Date(),
        transaction_type: 'sale',
        quantity: quantity_sold,
        opening_stock,
        closing_stock: opening_stock - quantity_sold,
        notes,
        created_by: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Also record in sales table
      await Sale.create({
        product_id,
        business_id: req.user.business_id,
        date: new Date(),
        quantity_sold,
        unit_price: product.selling_price,
        total_revenue: quantity_sold * product.selling_price,
        sales_channel: 'in_store'
      });
    }
    
    // Record production transaction if any
    if (quantity_produced && quantity_produced > 0) {
      await InventoryTransaction.create({
        product_id,
        business_id: req.user.business_id,
        date: new Date(),
        transaction_type: 'production',
        quantity: quantity_produced,
        opening_stock,
        closing_stock: opening_stock + quantity_produced,
        notes,
        created_by: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Record waste transaction if any
    if (quantity_wasted && quantity_wasted > 0) {
      await InventoryTransaction.create({
        product_id,
        business_id: req.user.business_id,
        date: new Date(),
        transaction_type: 'waste',
        quantity: quantity_wasted,
        opening_stock,
        closing_stock: opening_stock - quantity_wasted,
        notes,
        created_by: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Update current inventory
    if (currentInventory) {
      await currentInventory.update({
        quantity: closing_stock,
        last_updated: new Date(),
        updated_by: req.user.id
      });
    } else {
      await CurrentInventory.create({
        product_id,
        business_id: req.user.business_id,
        quantity: closing_stock,
        last_updated: new Date(),
        updated_by: req.user.id
      });
    }
    
    // Get updated inventory
    const updatedInventory = await CurrentInventory.findOne({
      where: { product_id },
      include: [{
        model: Product,
        as: 'product'
      }]
    });
    
    res.json({
      message: 'Inventory updated successfully',
      inventory: updatedInventory
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Failed to update inventory', details: error.message });
  }
};

// Get inventory transactions history
exports.getTransactionHistory = async (req, res) => {
  try {
    const { product_id, start_date, end_date, transaction_type } = req.query;
    
    const where = {
      business_id: req.user.business_id
    };
    
    if (product_id) where.product_id = product_id;
    if (transaction_type) where.transaction_type = transaction_type;
    if (start_date && end_date) {
      where.date = {
        [Op.between]: [start_date, end_date]
      };
    }
    
    const transactions = await InventoryTransaction.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'category']
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 100
    });
    
    res.json({
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions', details: error.message });
  }
};

// Get sales history
exports.getSalesHistory = async (req, res) => {
  try {
    const { product_id, start_date, end_date } = req.query;
    
    const where = {
      business_id: req.user.business_id
    };
    
    if (product_id) where.product_id = product_id;
    if (start_date && end_date) {
      where.date = {
        [Op.between]: [start_date, end_date]
      };
    }
    
    const sales = await Sale.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'category', 'unit']
      }],
      order: [['date', 'DESC']],
      limit: 100
    });
    
    res.json({
      count: sales.length,
      sales
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Failed to get sales', details: error.message });
  }
};

// Create a new inventory transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      product_id,
      transaction_type,
      quantity,
      date,
      notes
    } = req.body;

    // Validate required fields
    if (!product_id || !transaction_type || !quantity) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['product_id', 'transaction_type', 'quantity']
      });
    }

    // Validate transaction type
    const validTypes = ['sale', 'purchase', 'waste', 'adjustment', 'production'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({
        error: 'Invalid transaction type',
        valid_types: validTypes
      });
    }

    // Get product
    const product = await Product.findOne({
      where: {
        id: product_id,
        business_id: req.user.business_id
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get current inventory
    const currentInventory = await CurrentInventory.findOne({
      where: { product_id }
    });

    const opening_stock = currentInventory ? parseFloat(currentInventory.quantity) : 0;

    // Calculate closing stock based on transaction type
    let closing_stock = opening_stock;
    if (transaction_type === 'sale' || transaction_type === 'waste') {
      closing_stock = opening_stock - parseFloat(quantity);
    } else if (transaction_type === 'purchase' || transaction_type === 'production') {
      closing_stock = opening_stock + parseFloat(quantity);
    } else if (transaction_type === 'adjustment') {
      closing_stock = parseFloat(quantity); // Set to exact quantity
    }

    // Create transaction
    const transaction = await InventoryTransaction.create({
      product_id,
      business_id: req.user.business_id,
      date: date || new Date(),
      transaction_type,
      quantity: parseFloat(quantity),
      opening_stock,
      closing_stock,
      notes,
      created_by: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update current inventory
    if (currentInventory) {
      await currentInventory.update({
        quantity: closing_stock,
        last_updated: new Date(),
        updated_by: req.user.id
      });
    } else {
      await CurrentInventory.create({
        product_id,
        business_id: req.user.business_id,
        quantity: closing_stock,
        last_updated: new Date(),
        updated_by: req.user.id
      });
    }

    // If it's a sale, also create a sale record
    if (transaction_type === 'sale') {
      await Sale.create({
        product_id,
        business_id: req.user.business_id,
        date: date || new Date(),
        quantity_sold: parseFloat(quantity),
        unit_price: product.selling_price || 0,
        total_revenue: parseFloat(quantity) * (product.selling_price || 0),
        sales_channel: 'in_store'
      });
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
      updated_stock: closing_stock
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      error: 'Failed to create transaction',
      details: error.message
    });
  }
};