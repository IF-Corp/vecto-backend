const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomePetCareLog = sequelize.define(
    'HomePetCareLog',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        care_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        done_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        provider: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        cost: {
            type: DataTypes.DECIMAL(10, 2),
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
    },
    {
        tableName: 'home_pet_care_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = HomePetCareLog;
