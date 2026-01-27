const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkDailyStandupTask = sequelize.define('WorkDailyStandupTask', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        standupId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'standup_id',
        },
        taskId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'task_id',
        },
        customDescription: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'custom_description',
        },
        isFromYesterday: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_from_yesterday',
        },
        status: {
            type: DataTypes.ENUM('completed', 'in_progress', 'not_started', 'blocked', 'deferred'),
            allowNull: false,
            defaultValue: 'not_started',
        },
    }, {
        tableName: 'work_daily_standup_tasks',
        underscored: true,
        timestamps: true,
        updatedAt: false,
    });

    WorkDailyStandupTask.associate = (models) => {
        WorkDailyStandupTask.belongsTo(models.WorkDailyStandup, {
            foreignKey: 'standupId',
            as: 'standup',
        });
        WorkDailyStandupTask.belongsTo(models.WorkTask, {
            foreignKey: 'taskId',
            as: 'task',
        });
    };

    return WorkDailyStandupTask;
};
