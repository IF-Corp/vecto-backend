const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AppearanceSettings = sequelize.define('AppearanceSettings', {
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
    theme: {
        type: DataTypes.ENUM('LIGHT', 'DARK', 'SYSTEM'),
        defaultValue: 'SYSTEM',
    },
    accentColor: {
        type: DataTypes.ENUM('BLUE', 'GREEN', 'PURPLE', 'ORANGE', 'PINK', 'TEAL', 'RED', 'YELLOW'),
        defaultValue: 'BLUE',
        field: 'accent_color',
    },
    compactMode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'compact_mode',
    },
    animationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'animations_enabled',
    },
    soundsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'sounds_enabled',
    },
    highContrast: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'high_contrast',
    },
    fontSize: {
        type: DataTypes.ENUM('SMALL', 'MEDIUM', 'LARGE'),
        defaultValue: 'MEDIUM',
        field: 'font_size',
    },
}, {
    tableName: 'appearance_settings',
    timestamps: true,
    underscored: true,
});

module.exports = AppearanceSettings;
