const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkoutDetail = sequelize.define('WorkoutDetail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    workout_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    exercise_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sets: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    duration_seconds: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    distance_meters: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    tableName: 'workout_details',
    timestamps: true,
    underscored: true
});

WorkoutDetail.associate = (models) => {
    WorkoutDetail.belongsTo(models.Workout, {
        foreignKey: 'workout_id',
        as: 'workout'
    });
};

module.exports = WorkoutDetail;
