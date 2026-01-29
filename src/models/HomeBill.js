const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeBill = sequelize.define(
    'HomeBill',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        space_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'home_spaces',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM(
                'RENT',
                'CONDO',
                'ELECTRICITY',
                'WATER',
                'GAS',
                'INTERNET',
                'PHONE',
                'STREAMING',
                'INSURANCE',
                'OTHER'
            ),
            allowNull: false,
            defaultValue: 'OTHER',
        },
        average_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        due_day: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reminder_days_before: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 3,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'home_bills',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeBill;
