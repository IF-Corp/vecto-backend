const { sequelize, DataTypes } = require('../config/database');

const NotificationSettings = sequelize.define('NotificationSettings', {
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
    emailEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'email_enabled',
    },
    pushEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'push_enabled',
    },
    remindersEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'reminders_enabled',
    },
    alertsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'alerts_enabled',
    },
    reportsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'reports_enabled',
    },
    gamificationEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'gamification_enabled',
    },
    quietHoursEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'quiet_hours_enabled',
    },
    quietHoursStart: {
        type: DataTypes.STRING(5),
        defaultValue: '22:00',
        field: 'quiet_hours_start',
    },
    quietHoursEnd: {
        type: DataTypes.STRING(5),
        defaultValue: '08:00',
        field: 'quiet_hours_end',
    },
}, {
    tableName: 'notification_settings',
    timestamps: true,
    underscored: true,
});

module.exports = NotificationSettings;
