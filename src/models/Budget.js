const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Budget = sequelize.define('Budget', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    // Legacy field for backward compatibility
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    limit_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    spent_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false
    },
    period: {
        type: DataTypes.ENUM('WEEKLY', 'MONTHLY', 'YEARLY'),
        allowNull: false
    },
    month: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    alert_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 80,
        allowNull: false,
        validate: { min: 0, max: 100 }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'budgets',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'category_id', 'month'],
            where: { category_id: { [require('sequelize').Op.ne]: null } }
        }
    ]
});

Budget.associate = (models) => {
    Budget.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Budget.belongsTo(models.FinanceCategory, {
        foreignKey: 'category_id',
        as: 'categoryRef'
    });
};

module.exports = Budget;
