const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkMeetingParticipant = sequelize.define('WorkMeetingParticipant', {
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    is_organizer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'work_meeting_participants',
    timestamps: true,
    underscored: true,
});

WorkMeetingParticipant.associate = (models) => {
    WorkMeetingParticipant.belongsTo(models.WorkMeeting, {
        foreignKey: 'meeting_id',
        as: 'meeting',
    });
};

module.exports = WorkMeetingParticipant;
