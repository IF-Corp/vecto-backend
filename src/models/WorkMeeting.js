const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkMeeting = sequelize.define('WorkMeeting', {
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
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
    },
    category: {
        type: DataTypes.ENUM('ONE_ON_ONE', 'DAILY', 'PLANNING', 'RETROSPECTIVE', 'CLIENT', 'INTERVIEW', 'OTHER'),
        allowNull: false,
        defaultValue: 'OTHER',
    },
    is_recurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    recurrence_type: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'),
        allowNull: true,
    },
    recurrence_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    meeting_link: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
}, {
    tableName: 'work_meetings',
    timestamps: true,
    underscored: true,
});

WorkMeeting.associate = (models) => {
    WorkMeeting.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkMeeting.belongsTo(models.WorkProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
    WorkMeeting.hasMany(models.WorkMeetingParticipant, {
        foreignKey: 'meeting_id',
        as: 'participants',
    });
    WorkMeeting.hasMany(models.WorkMeetingNote, {
        foreignKey: 'meeting_id',
        as: 'notes',
    });
    WorkMeeting.hasMany(models.WorkMeetingAction, {
        foreignKey: 'meeting_id',
        as: 'actions',
    });
};

module.exports = WorkMeeting;
