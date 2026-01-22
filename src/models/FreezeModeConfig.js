const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FreezeModeConfig = sequelize.define('FreezeModeConfig', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pause_habits: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    pause_tasks: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    pause_notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    auto_resume: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'freeze_mode_config',
    timestamps: true,
    underscored: true
});

FreezeModeConfig.associate = (models) => {
    FreezeModeConfig.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = FreezeModeConfig;
