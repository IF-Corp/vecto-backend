const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
        defaultValue: 'MEDIUM',
        allowNull: false
    },
    scheduled_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    scheduled_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    estimated_duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('BACKLOG', 'TODO', 'DOING', 'DONE'),
        defaultValue: 'BACKLOG',
        allowNull: false
    },
    assignees: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    underscored: true
});

Task.associate = (models) => {
    Task.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Task.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project'
    });
};

module.exports = Task;
