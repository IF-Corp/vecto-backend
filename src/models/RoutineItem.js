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
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    estimated_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes'
    },
    item_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // Legacy field for backward compatibility
    habit_id: {
        type: DataTypes.UUID,
        allowNull: true
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
};

module.exports = RoutineItem;
