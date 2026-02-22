const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('owner', 'manager', 'staff'),
      defaultValue: 'staff'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    two_factor_secret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    two_factor_backup_codes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  // ADD THESE HOOKS - This is what's missing!
  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Associations
  User.associate = (models) => {
    User.belongsTo(models.Business, {
      foreignKey: 'business_id',
      as: 'business'
    });
  };

  return User;
};