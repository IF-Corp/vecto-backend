const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialEvent = sequelize.define(
    'SocialEvent',
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        event_type: {
            type: DataTypes.ENUM('PARTY', 'BBQ', 'MEETUP', 'DINNER', 'TRIP', 'BIRTHDAY', 'WEDDING', 'OTHER'),
            allowNull: false,
            defaultValue: 'MEETUP',
        },
        event_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        event_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        location_type: {
            type: DataTypes.ENUM('ADDRESS', 'HOME_SPACE', 'ONLINE'),
            allowNull: false,
            defaultValue: 'ADDRESS',
        },
        location_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        home_space_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        estimated_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        actual_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('PLANNING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PLANNING',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'social_events',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialEvent;
