const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FinanceCategory = sequelize.define('FinanceCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true // null for default system categories
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('EXPENSE', 'INCOME'),
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(7), // hex color
        allowNull: true
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'finance_categories',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'name', 'type'],
            where: { user_id: { [require('sequelize').Op.ne]: null } }
        }
    ]
});

FinanceCategory.associate = (models) => {
    FinanceCategory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    FinanceCategory.hasMany(models.Transaction, {
        foreignKey: 'category_id',
        as: 'transactions'
    });
    FinanceCategory.hasMany(models.Budget, {
        foreignKey: 'category_id',
        as: 'budgets'
    });
};

module.exports = FinanceCategory;
