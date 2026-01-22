const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserPreferences = sequelize.define('UserPreferences', {
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
    default_currency: {
        type: DataTypes.ENUM('BRL', 'USD', 'EUR'),
        defaultValue: 'BRL',
        allowNull: false
    },
    timezone: {
        type: DataTypes.STRING,
        defaultValue: 'America/Sao_Paulo',
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'pt-BR',
        allowNull: false
    },
    date_format: {
        type: DataTypes.ENUM('DD/MM', 'MM/DD'),
        defaultValue: 'DD/MM',
        allowNull: false
    },
    week_start_day: {
        type: DataTypes.ENUM('SUN', 'MON'),
        defaultValue: 'SUN',
        allowNull: false
    },
    theme: {
        type: DataTypes.ENUM('DARK', 'LIGHT', 'SYSTEM'),
        defaultValue: 'SYSTEM',
        allowNull: false
    },
    sounds_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    compact_mode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true
});

UserPreferences.associate = (models) => {
    UserPreferences.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = UserPreferences;
