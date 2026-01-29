const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeStockItem = sequelize.define(
    'HomeStockItem',
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
            type: DataTypes.ENUM('FOOD', 'CLEANING', 'HYGIENE', 'PET', 'OTHER'),
            allowNull: false,
            defaultValue: 'OTHER',
        },
        current_quantity: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        min_quantity: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 1,
        },
        unit: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'home_stock_items',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeStockItem;
