const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Transaction = sequelize.define('Transaction', {
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
    account_id: {
        type: DataTypes.UUID,
        allowNull: true // null for cash/pix transactions
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    card_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    invoice_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    // Legacy fields for backward compatibility
    primary_category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    secondary_category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
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
    // Installment fields
    is_installment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    installment_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    current_installment: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    total_installments: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // Recurring fields
    is_recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    recurring_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
        defaultValue: 'CONFIRMED',
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    attachment_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true
});

Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Transaction.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account'
    });
    Transaction.belongsTo(models.FinanceCategory, {
        foreignKey: 'category_id',
        as: 'category'
    });
    Transaction.belongsTo(models.Card, {
        foreignKey: 'card_id',
        as: 'card'
    });
    Transaction.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
    });
};

module.exports = Transaction;
