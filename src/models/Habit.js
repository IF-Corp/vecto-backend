const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Habit = sequelize.define('Habit', {
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
    context_tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    ideal_time: {
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
    is_frozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'habits',
    timestamps: true,
    underscored: true
});

Habit.associate = (models) => {
    Habit.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Habit.hasMany(models.HabitLog, {
        foreignKey: 'habit_id',
        as: 'logs'
    });
    Habit.belongsToMany(models.Routine, {
        through: models.RoutineItem,
        foreignKey: 'habit_id',
        otherKey: 'routine_id',
        as: 'routines'
    });
};

module.exports = Habit;
