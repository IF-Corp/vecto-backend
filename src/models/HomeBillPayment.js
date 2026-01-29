const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeBillPayment = sequelize.define(
    'HomeBillPayment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        bill_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'home_bills',
                key: 'id',
            },
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        paid_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paid_by_member_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'home_members',
                key: 'id',
            },
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        finance_transaction_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        tableName: 'home_bill_payments',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeBillPayment;
