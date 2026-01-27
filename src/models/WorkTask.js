const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkTask = sequelize.define('WorkTask', {
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
    project_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    type_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    status_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_urgent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_important: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    priority_quadrant: {
        type: DataTypes.ENUM('DO_NOW', 'SCHEDULE', 'DELEGATE', 'ELIMINATE'),
        allowNull: false,
        defaultValue: 'ELIMINATE',
    },
    estimated_hours: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
    },
    actual_hours: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
        defaultValue: 0,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    scheduled_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    reminder_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
}, {
    tableName: 'work_tasks',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeSave: (task) => {
            // Calculate priority quadrant based on urgency and importance
            task.priority_quadrant = calculatePriorityQuadrant(task.is_urgent, task.is_important);
        },
    },
});

// Helper function to calculate Eisenhower priority quadrant
function calculatePriorityQuadrant(isUrgent, isImportant) {
    if (isUrgent && isImportant) return 'DO_NOW';
    if (!isUrgent && isImportant) return 'SCHEDULE';
    if (isUrgent && !isImportant) return 'DELEGATE';
    return 'ELIMINATE';
}

WorkTask.associate = (models) => {
    WorkTask.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkTask.belongsTo(models.WorkProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
    WorkTask.belongsTo(models.WorkTaskType, {
        foreignKey: 'type_id',
        as: 'type',
    });
    WorkTask.belongsTo(models.WorkTaskStatus, {
        foreignKey: 'status_id',
        as: 'status',
    });
    WorkTask.hasMany(models.WorkTimeEntry, {
        foreignKey: 'task_id',
        as: 'timeEntries',
    });
};

// Export helper function for use in controllers
WorkTask.calculatePriorityQuadrant = calculatePriorityQuadrant;

module.exports = WorkTask;
