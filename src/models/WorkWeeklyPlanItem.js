const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkWeeklyPlanItem = sequelize.define('WorkWeeklyPlanItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        planId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'plan_id',
        },
        taskId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'task_id',
        },
        customTitle: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'custom_title',
        },
        priorityOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'priority_order',
        },
        targetDay: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'target_day',
        },
        estimatedHours: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: true,
            field: 'estimated_hours',
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_completed',
        },
    }, {
        tableName: 'work_weekly_plan_items',
        underscored: true,
        timestamps: true,
    });

    WorkWeeklyPlanItem.associate = (models) => {
        WorkWeeklyPlanItem.belongsTo(models.WorkWeeklyPlan, {
            foreignKey: 'planId',
            as: 'plan',
        });
        WorkWeeklyPlanItem.belongsTo(models.WorkTask, {
            foreignKey: 'taskId',
            as: 'task',
        });
    };

    return WorkWeeklyPlanItem;
};
