const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialSettings = sequelize.define(
    'SocialSettings',
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
        enable_commitments: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        enable_gifts: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        enable_health_score: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        enable_social_battery: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'social_settings',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialSettings;
