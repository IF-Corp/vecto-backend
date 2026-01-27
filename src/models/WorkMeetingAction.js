const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkMeetingAction = sequelize.define('WorkMeetingAction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    meeting_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    assignee: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    converted_task_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    tableName: 'work_meeting_actions',
    timestamps: true,
    underscored: true,
});

WorkMeetingAction.associate = (models) => {
    WorkMeetingAction.belongsTo(models.WorkMeeting, {
        foreignKey: 'meeting_id',
        as: 'meeting',
    });
    WorkMeetingAction.belongsTo(models.WorkTask, {
        foreignKey: 'converted_task_id',
        as: 'convertedTask',
    });
};

module.exports = WorkMeetingAction;
