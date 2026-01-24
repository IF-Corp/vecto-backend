const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const RoutineExecutionItem = sequelize.define('RoutineExecutionItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    execution_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    item_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    item_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Snapshot of item title at execution time'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duration in seconds'
    }
}, {
    tableName: 'routine_execution_items',
    timestamps: true,
    underscored: true
});

RoutineExecutionItem.associate = (models) => {
    RoutineExecutionItem.belongsTo(models.RoutineExecution, {
        foreignKey: 'execution_id',
        as: 'execution'
    });
    RoutineExecutionItem.belongsTo(models.RoutineItem, {
        foreignKey: 'item_id',
        as: 'item'
    });
};

module.exports = RoutineExecutionItem;
