const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkTaskStatus = sequelize.define('WorkTaskStatus', {
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
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '#64748b',
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_done_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'work_task_statuses',
    timestamps: true,
    underscored: true,
});

WorkTaskStatus.associate = (models) => {
    WorkTaskStatus.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkTaskStatus.hasMany(models.WorkTask, {
        foreignKey: 'status_id',
        as: 'tasks',
    });
};

module.exports = WorkTaskStatus;
