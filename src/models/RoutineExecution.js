const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RoutineExecution = sequelize.define('RoutineExecution', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    routine_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    execution_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    total_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Total duration in seconds'
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('in_progress', 'paused', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'completed'
    },
    paused_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Accumulated pause time in seconds'
    },
    paused_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'Timestamp when session was paused'
    }
}, {
    tableName: 'routine_executions',
    timestamps: true,
    underscored: true
});

RoutineExecution.associate = (models) => {
    RoutineExecution.belongsTo(models.Routine, {
        foreignKey: 'routine_id',
        as: 'routine'
    });
    RoutineExecution.hasMany(models.RoutineExecutionItem, {
        foreignKey: 'execution_id',
        as: 'itemTimes'
    });
};

module.exports = RoutineExecution;
