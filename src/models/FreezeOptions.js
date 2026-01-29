const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FreezeOptions = sequelize.define('FreezeOptions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    freeze_period_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    freeze_streaks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    hide_non_essential_tasks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    pause_general_notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    pause_goals: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    keep_important_events: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'freeze_options',
    timestamps: true,
    underscored: true
});

FreezeOptions.associate = (models) => {
    FreezeOptions.belongsTo(models.FreezePeriod, {
        foreignKey: 'freeze_period_id',
        as: 'freezePeriod'
    });
};

module.exports = FreezeOptions;
