const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialInteraction = sequelize.define(
    'SocialInteraction',
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
        event_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        interaction_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        interaction_type: {
            type: DataTypes.ENUM('IN_PERSON', 'CALL', 'VIDEO_CALL', 'MESSAGE'),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'social_interactions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialInteraction;
