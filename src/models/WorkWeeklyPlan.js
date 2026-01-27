const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkWeeklyPlan = sequelize.define('WorkWeeklyPlan', {
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
        weekStart: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'week_start',
        },
        weekEnd: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'week_end',
        },
        availableHours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 40,
            field: 'available_hours',
        },
        meetingHours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'meeting_hours',
        },
        workHours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'work_hours',
        },
        estimatedHours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'estimated_hours',
        },
        actualHours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'actual_hours',
        },
        status: {
            type: DataTypes.ENUM('draft', 'active', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'work_weekly_plans',
        underscored: true,
        timestamps: true,
    });

    WorkWeeklyPlan.associate = (models) => {
        WorkWeeklyPlan.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        WorkWeeklyPlan.hasMany(models.WorkWeeklyPlanItem, {
            foreignKey: 'planId',
            as: 'items',
        });
    };

    // Check if plan has deficit
    WorkWeeklyPlan.prototype.hasDeficit = function() {
        return parseFloat(this.estimatedHours) > parseFloat(this.workHours);
    };

    // Get deficit hours
    WorkWeeklyPlan.prototype.getDeficit = function() {
        const diff = parseFloat(this.estimatedHours) - parseFloat(this.workHours);
        return diff > 0 ? diff : 0;
    };

    return WorkWeeklyPlan;
};
