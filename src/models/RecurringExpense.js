const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RecurringExpense = sequelize.define('RecurringExpense', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    frequency: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    due_day: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    next_due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'recurring_expenses',
    timestamps: true,
    underscored: true
});

RecurringExpense.associate = (models) => {
    RecurringExpense.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = RecurringExpense;
