const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkTimeEntry = sequelize.define('WorkTimeEntry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    task_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_billable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_running: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'work_time_entries',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeSave: (entry) => {
            // Calculate duration if both start and end are set
            if (entry.started_at && entry.ended_at) {
                const start = new Date(entry.started_at);
                const end = new Date(entry.ended_at);
                entry.duration_minutes = Math.round((end - start) / 60000);
            }
        },
    },
});

WorkTimeEntry.associate = (models) => {
    WorkTimeEntry.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkTimeEntry.belongsTo(models.WorkTask, {
        foreignKey: 'task_id',
        as: 'task',
    });
    WorkTimeEntry.belongsTo(models.WorkProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
};

module.exports = WorkTimeEntry;
