const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Subtask = sequelize.define('Subtask', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    task_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tasks',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    tableName: 'subtasks',
    timestamps: true,
    underscored: true
});

Subtask.associate = (models) => {
    Subtask.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task',
        onDelete: 'CASCADE'
    });
};

module.exports = Subtask;
