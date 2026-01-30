const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DashboardAlertSetting = sequelize.define('DashboardAlertSetting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    alertType: {
        type: DataTypes.ENUM('STREAK_RISK', 'OVERDUE_TASKS', 'UPCOMING_BILLS', 'BIRTHDAYS', 'HIGH_STRAIN', 'MEDICATIONS', 'MAINTENANCES', 'DEADLINES', 'LOW_STOCK', 'SOCIAL_NEEDS_ATTENTION', 'UPCOMING_EVENTS'),
        allowNull: false,
        field: 'alert_type',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
    daysBefore: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        field: 'days_before',
    },
}, {
    tableName: 'dashboard_alert_settings',
    timestamps: true,
    underscored: true,
});

module.exports = DashboardAlertSetting;
