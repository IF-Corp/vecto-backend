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
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    limit_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    spent_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false
    },
    period: {
        type: DataTypes.ENUM('WEEKLY', 'MONTHLY', 'YEARLY'),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    alert_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 80,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'budgets',
    timestamps: true,
    underscored: true
});

Budget.associate = (models) => {
    Budget.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = Budget;
