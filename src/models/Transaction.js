const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    account_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    primary_category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    secondary_category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('INCOME', 'EXPENSE'),
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'CONSOLIDATED'),
        defaultValue: 'PENDING',
        allowNull: false
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true
});

Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account'
    });
};

module.exports = Transaction;
