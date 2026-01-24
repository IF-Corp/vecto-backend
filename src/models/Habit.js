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
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Geral'
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
    time_period: {
        type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'anytime'),
        allowNull: true,
        defaultValue: 'anytime'
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
    estimated_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes'
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
};

module.exports = Habit;
