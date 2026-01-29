const { sequelize, DataTypes } = require('../config/database');

const PreferenceSettings = sequelize.define('PreferenceSettings', {
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
    language: {
        type: DataTypes.STRING(10),
        defaultValue: 'pt-BR',
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'BRL',
    },
    dateFormat: {
        type: DataTypes.STRING(20),
        defaultValue: 'DD/MM/YYYY',
        field: 'date_format',
    },
    timeFormat: {
        type: DataTypes.ENUM('12h', '24h'),
        defaultValue: '24h',
        field: 'time_format',
    },
    weekStartsOn: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'week_starts_on',
    },
    timezone: {
        type: DataTypes.STRING(50),
        defaultValue: 'America/Sao_Paulo',
    },
}, {
    tableName: 'preference_settings',
    timestamps: true,
    underscored: true,
});

module.exports = PreferenceSettings;
