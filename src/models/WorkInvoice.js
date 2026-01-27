const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkInvoice = sequelize.define('WorkInvoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    client_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    period_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    period_end: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    total_hours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'INVOICED', 'PAID'),
        allowNull: false,
        defaultValue: 'PENDING',
    },
    invoiced_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    finance_transaction_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    tableName: 'work_invoices',
    timestamps: true,
    underscored: true,
});

WorkInvoice.associate = (models) => {
    WorkInvoice.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkInvoice.belongsTo(models.WorkClient, {
        foreignKey: 'client_id',
        as: 'client',
    });
};

module.exports = WorkInvoice;
