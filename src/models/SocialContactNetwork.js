const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialContactNetwork = sequelize.define(
    'SocialContactNetwork',
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
        network_type: {
            type: DataTypes.ENUM('INSTAGRAM', 'LINKEDIN', 'FACEBOOK', 'TWITTER', 'TIKTOK', 'WHATSAPP', 'TELEGRAM', 'OTHER'),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        tableName: 'social_contact_networks',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialContactNetwork;
