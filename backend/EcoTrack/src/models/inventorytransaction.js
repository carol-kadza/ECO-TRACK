const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryTransaction = sequelize.define('InventoryTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    transaction_type: {
      type: DataTypes.ENUM('purchase', 'sale', 'waste', 'adjustment', 'return', 'production'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    opening_stock: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    closing_stock: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'inventorytransactions',
    timestamps: true,  // Enable automatic timestamp fields
    underscored: false,  // Keep camelCase for createdAt/updatedAt
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  // Define associations
  InventoryTransaction.associate = (models) => {
    InventoryTransaction.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    
    InventoryTransaction.belongsTo(models.Business, {
      foreignKey: 'business_id',
      as: 'business'
    });
    
    if (models.User) {
      InventoryTransaction.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
    }
  };

  return InventoryTransaction;
};