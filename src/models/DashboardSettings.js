const { sequelize, DataTypes } = require('../config/database');

const DashboardSettings = sequelize.define('DashboardSettings', {
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
    showTurnCalendar: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_turn_calendar',
    },
    turnDurationHours: {
        type: DataTypes.INTEGER,
        defaultValue: 8,
        field: 'turn_duration_hours',
    },
    showWeeklyMetrics: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_weekly_metrics',
    },
    showGreeting: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_greeting',
    },
    showAlerts: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_alerts',
    },
}, {
    tableName: 'dashboard_settings',
    timestamps: true,
    underscored: true,
});

module.exports = DashboardSettings;
