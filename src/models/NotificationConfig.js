const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const NotificationConfig = sequelize.define('NotificationConfig', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    channel: {
        type: DataTypes.ENUM('EMAIL', 'PUSH', 'WHATSAPP'),
        allowNull: false
    },
    alert_type: {
        type: DataTypes.ENUM('REMINDERS', 'WEEKLY_REPORT', 'ACHIEVEMENTS'),
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'notification_config',
    timestamps: true,
    underscored: true
});

NotificationConfig.associate = (models) => {
    NotificationConfig.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = NotificationConfig;
