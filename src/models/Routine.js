const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Routine = sequelize.define('Routine', {
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
    start_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    frequency: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'CUSTOM'),
        defaultValue: 'DAILY',
        allowNull: false
    },
    frequency_days: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: true
    },
    current_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    best_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'archived'),
        defaultValue: 'active',
        allowNull: false
    },
    average_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Average execution duration in seconds'
    },
    is_frozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'routines',
    timestamps: true,
    underscored: true
});

Routine.associate = (models) => {
    Routine.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Routine.hasMany(models.RoutineItem, {
        foreignKey: 'routine_id',
        as: 'items'
    });
    Routine.hasMany(models.RoutineExecution, {
        foreignKey: 'routine_id',
        as: 'executions'
    });
};

module.exports = Routine;
