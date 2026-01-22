const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MeetingHistory = sequelize.define('MeetingHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    actual_duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    agenda_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    documentation_link: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'meeting_history',
    timestamps: true,
    underscored: true
});

MeetingHistory.associate = (models) => {
    MeetingHistory.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project'
    });
};

module.exports = MeetingHistory;
