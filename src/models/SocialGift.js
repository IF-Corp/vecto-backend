const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialGift = sequelize.define(
    'SocialGift',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        contact_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        gift_type: {
            type: DataTypes.ENUM('GIVEN', 'RECEIVED'),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        occasion: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'social_gifts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialGift;
