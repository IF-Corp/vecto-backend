const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkEnergyLog = sequelize.define('WorkEnergyLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    energyLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'energy_level',
        validate: {
            min: 1,
            max: 10,
        },
    },
    activityType: {
        type: DataTypes.ENUM('deep_work', 'meetings', 'admin', 'creative', 'break', 'other'),
        allowNull: true,
        field: 'activity_type',
    },
    source: {
        type: DataTypes.ENUM('standup', 'end_of_day', 'manual', 'work_mode'),
        allowNull: false,
        defaultValue: 'manual',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'work_energy_logs',
    timestamps: true,
    underscored: true,
});

WorkEnergyLog.associate = (models) => {
    WorkEnergyLog.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });
};

module.exports = WorkEnergyLog;
