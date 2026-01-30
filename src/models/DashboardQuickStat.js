const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DashboardQuickStat = sequelize.define('DashboardQuickStat', {
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
    statType: {
        type: DataTypes.ENUM('HABITS', 'TASKS', 'WORK', 'RECOVERY', 'BALANCE', 'CALORIES', 'STUDY_TIME', 'HOME_TASKS', 'SOCIAL_BATTERY'),
        allowNull: false,
        field: 'stat_type',
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
}, {
    tableName: 'dashboard_quick_stats',
    timestamps: true,
    underscored: true,
});

module.exports = DashboardQuickStat;
