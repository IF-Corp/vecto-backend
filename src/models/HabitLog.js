const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HabitLog = sequelize.define('HabitLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    habit_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    execution_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('DONE', 'FAILED', 'SKIPPED'),
        allowNull: false
    }
}, {
    tableName: 'habit_logs',
    timestamps: true,
    underscored: true
});

HabitLog.associate = (models) => {
    HabitLog.belongsTo(models.Habit, {
        foreignKey: 'habit_id',
        as: 'habit'
    });
};

module.exports = HabitLog;
