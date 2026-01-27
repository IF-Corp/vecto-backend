const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkMeetingNote = sequelize.define('WorkMeetingNote', {
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'work_meeting_notes',
    timestamps: true,
    underscored: true,
});

WorkMeetingNote.associate = (models) => {
    WorkMeetingNote.belongsTo(models.WorkMeeting, {
        foreignKey: 'meeting_id',
        as: 'meeting',
    });
};

module.exports = WorkMeetingNote;
