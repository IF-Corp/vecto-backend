const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'PAUSED'),
        defaultValue: 'IN_PROGRESS',
        allowNull: false
    },
    life_area: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'projects',
    timestamps: true,
    underscored: true
});

Project.associate = (models) => {
    Project.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Project.hasMany(models.Task, {
        foreignKey: 'project_id',
        as: 'tasks'
    });
    Project.hasMany(models.MeetingHistory, {
        foreignKey: 'project_id',
        as: 'meetings'
    });
};

module.exports = Project;
