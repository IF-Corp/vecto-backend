const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DashboardWidget = sequelize.define('DashboardWidget', {
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
    widgetType: {
        type: DataTypes.ENUM('HABITS_TODAY', 'TASKS_TODAY', 'WORK', 'UPCOMING_EVENTS', 'FINANCIAL_SUMMARY', 'MODULE_SCORES', 'HOME', 'SOCIAL', 'HEALTH', 'STUDY', 'CALENDAR'),
        allowNull: false,
        field: 'widget_type',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
    displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'display_order',
    },
    columnPosition: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'column_position',
    },
}, {
    tableName: 'dashboard_widgets',
    timestamps: true,
    underscored: true,
});

module.exports = DashboardWidget;
