const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RoutineItem = sequelize.define('RoutineItem', {
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
    habit_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    execution_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'routine_items',
    timestamps: true,
    underscored: true
});

RoutineItem.associate = (models) => {
    RoutineItem.belongsTo(models.Routine, {
        foreignKey: 'routine_id',
        as: 'routine'
    });
    RoutineItem.belongsTo(models.Habit, {
        foreignKey: 'habit_id',
        as: 'habit'
    });
};

module.exports = RoutineItem;
