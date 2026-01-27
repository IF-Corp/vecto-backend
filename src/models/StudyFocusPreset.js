const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyFocusPreset = sequelize.define('StudyFocusPreset', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: true,
    },
    block_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    short_break_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    long_break_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    blocks_until_long_break: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 4,
    },
    is_system: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'study_focus_presets',
    timestamps: true,
    underscored: true,
});

StudyFocusPreset.associate = (models) => {
    StudyFocusPreset.hasMany(models.StudyFocusSession, {
        foreignKey: 'preset_id',
        as: 'sessions',
    });
};

module.exports = StudyFocusPreset;
