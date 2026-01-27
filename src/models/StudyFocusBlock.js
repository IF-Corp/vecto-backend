const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyFocusBlock = sequelize.define('StudyFocusBlock', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_focus_sessions',
            key: 'id',
        },
    },
    block_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    block_type: {
        type: DataTypes.ENUM('STUDY', 'SHORT_BREAK', 'LONG_BREAK'),
        allowNull: false,
    },
    planned_duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    actual_duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    finished_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    skipped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'study_focus_blocks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

StudyFocusBlock.associate = (models) => {
    StudyFocusBlock.belongsTo(models.StudyFocusSession, {
        foreignKey: 'session_id',
        as: 'session',
    });
};

module.exports = StudyFocusBlock;
