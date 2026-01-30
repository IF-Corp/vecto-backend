const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialContactReminder = sequelize.define(
    'SocialContactReminder',
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
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        frequency_type: {
            type: DataTypes.ENUM('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'),
            allowNull: false,
            defaultValue: 'MONTHLY',
        },
        frequency_days: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        preferred_contact_type: {
            type: DataTypes.ENUM('ANY', 'IN_PERSON', 'CALL', 'MESSAGE'),
            allowNull: false,
            defaultValue: 'ANY',
        },
        last_interaction_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        last_interaction_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    },
    {
        tableName: 'social_contact_reminders',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialContactReminder;
