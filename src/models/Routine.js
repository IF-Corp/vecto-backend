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
    Routine.belongsToMany(models.Habit, {
        through: models.RoutineItem,
        foreignKey: 'routine_id',
        otherKey: 'habit_id',
        as: 'habits'
    });
};

module.exports = Routine;
