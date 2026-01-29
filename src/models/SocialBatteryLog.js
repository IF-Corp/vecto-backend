const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialBatteryLog = sequelize.define(
    'SocialBatteryLog',
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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        battery_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
        },
        social_events_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        recharge_time_hours: {
            type: DataTypes.DECIMAL(4, 1),
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'social_battery_log',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialBatteryLog;
