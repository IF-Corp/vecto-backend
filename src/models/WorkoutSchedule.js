const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkoutSchedule = sequelize.define('WorkoutSchedule', {
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
    workout_type: {
        type: DataTypes.ENUM('CARDIO', 'STRENGTH', 'FLEXIBILITY', 'SPORTS', 'OTHER'),
        allowNull: false
    },
    day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 6 }
    },
    scheduled_time: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'workout_schedules',
    timestamps: true,
    underscored: true
});

WorkoutSchedule.associate = (models) => {
    WorkoutSchedule.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = WorkoutSchedule;
