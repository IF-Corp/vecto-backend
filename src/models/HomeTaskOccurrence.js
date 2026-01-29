const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeTaskOccurrence = sequelize.define('HomeTaskOccurrence', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    task_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'SKIPPED'),
        allowNull: false,
        defaultValue: 'PENDING',
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    completed_by_member_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'home_task_occurrences',
    timestamps: true,
    underscored: true,
});

HomeTaskOccurrence.associate = (models) => {
    HomeTaskOccurrence.belongsTo(models.HomeTask, {
        foreignKey: 'task_id',
        as: 'task',
    });
    HomeTaskOccurrence.belongsTo(models.HomeMember, {
        foreignKey: 'completed_by_member_id',
        as: 'completedBy',
    });
};

module.exports = HomeTaskOccurrence;
