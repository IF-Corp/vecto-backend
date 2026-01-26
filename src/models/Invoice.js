const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Invoice = sequelize.define('Invoice', {
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
    card_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reference_month: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    closing_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('OPEN', 'CLOSED', 'PAID', 'PARTIAL', 'OVERDUE'),
        defaultValue: 'OPEN',
        allowNull: false
    },
    paid_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['card_id', 'reference_month']
        }
    ]
});

Invoice.associate = (models) => {
    Invoice.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Invoice.belongsTo(models.Card, {
        foreignKey: 'card_id',
        as: 'card'
    });
    Invoice.hasMany(models.Transaction, {
        foreignKey: 'invoice_id',
        as: 'transactions'
    });
};

module.exports = Invoice;
