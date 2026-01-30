const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialGiftIdea = sequelize.define(
    'SocialGiftIdea',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        contact_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        estimated_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
            allowNull: false,
            defaultValue: 'MEDIUM',
        },
        is_purchased: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'social_gift_ideas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialGiftIdea;
