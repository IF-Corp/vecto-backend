const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkTaskType = sequelize.define('WorkTaskType', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true, // null for system defaults
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'circle',
    },
    color: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '#6366f1',
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'work_task_types',
    timestamps: true,
    underscored: true,
});

WorkTaskType.associate = (models) => {
    WorkTaskType.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkTaskType.hasMany(models.WorkTask, {
        foreignKey: 'type_id',
        as: 'tasks',
    });
};

module.exports = WorkTaskType;
