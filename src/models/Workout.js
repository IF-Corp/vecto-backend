const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Workout = sequelize.define('Workout', {
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
    type: {
        type: DataTypes.ENUM('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'SPORTS', 'OTHER'),
        allowNull: false
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    calories_burned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    workout_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'workouts',
    timestamps: true,
    underscored: true
});

Workout.associate = (models) => {
    Workout.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Workout.hasMany(models.WorkoutDetail, {
        foreignKey: 'workout_id',
        as: 'details'
    });
};

module.exports = Workout;
