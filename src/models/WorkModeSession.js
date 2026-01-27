const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkModeSession = sequelize.define('WorkModeSession', {
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
    modeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'mode_id',
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'project_id',
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'task_id',
    },
    status: {
        type: DataTypes.ENUM('in_progress', 'paused', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'in_progress',
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'started_at',
    },
    finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'finished_at',
    },
    pausedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'paused_at',
    },
    plannedDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'planned_duration',
    },
    actualDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'actual_duration',
    },
    pausedDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'paused_duration',
    },
    blocksCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'blocks_completed',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'work_mode_sessions',
    underscored: true,
    timestamps: true,
});

WorkModeSession.associate = (models) => {
    WorkModeSession.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });
    WorkModeSession.belongsTo(models.WorkMode, {
        foreignKey: 'modeId',
        as: 'mode',
    });
    WorkModeSession.belongsTo(models.WorkProject, {
        foreignKey: 'projectId',
        as: 'project',
    });
    WorkModeSession.belongsTo(models.WorkTask, {
        foreignKey: 'taskId',
        as: 'task',
    });
};

module.exports = WorkModeSession;
