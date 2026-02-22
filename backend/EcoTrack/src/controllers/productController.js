const { Product, CurrentInventory } = require('../models');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        business_id: req.user.business_id,
        is_active: true
      },
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }],
      order: [['name', 'ASC']]
    });
    
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products', details: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        business_id: req.user.business_id
      },
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }]
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product', details: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      unit,
      shelf_life_days,
      reorder_point,
      production_cost,
      selling_price,
      is_perishable,
      initial_quantity
    } = req.body;
    
    // Create product
    const product = await Product.create({
      business_id: req.user.business_id,
      name,
      sku,
      category: category || 'general',
      unit: unit || 'pieces',
      shelf_life_days,
      reorder_point: reorder_point || 10,
      production_cost: production_cost || 0,
      selling_price: selling_price || 0,
      is_perishable: is_perishable !== undefined ? is_perishable : true,
      is_active: true
    });
    
    // Create initial inventory record
    await CurrentInventory.create({
      product_id: product.id,
      business_id: req.user.business_id,
      quantity: initial_quantity || 0,
      last_updated: new Date(),
      updated_by: req.user.id
    });
    
    // Fetch product with inventory
    const createdProduct = await Product.findByPk(product.id, {
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }]
    });
    
    res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        business_id: req.user.business_id
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.update(req.body);
    
    // Fetch updated product with inventory
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{
        model: CurrentInventory,
        as: 'current_inventory'
      }]
    });
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
};

// Delete product (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        business_id: req.user.business_id
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.update({ is_active: false });
    
    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};