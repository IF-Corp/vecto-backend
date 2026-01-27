const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyFocusSession = sequelize.define('StudyFocusSession', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    preset_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_focus_presets',
            key: 'id',
        },
    },
    topic_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_topics',
            key: 'id',
        },
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_subjects',
            key: 'id',
        },
    },
    custom_block_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    custom_break_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    planned_blocks: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    completed_blocks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_focus_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_break_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    skipped_breaks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'IN_PROGRESS',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'study_focus_sessions',
    timestamps: true,
    underscored: true,
});

StudyFocusSession.associate = (models) => {
    StudyFocusSession.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyFocusSession.belongsTo(models.StudyFocusPreset, {
        foreignKey: 'preset_id',
        as: 'preset',
    });
    StudyFocusSession.belongsTo(models.StudyTopic, {
        foreignKey: 'topic_id',
        as: 'topic',
    });
    StudyFocusSession.belongsTo(models.StudySubject, {
        foreignKey: 'subject_id',
        as: 'subject',
    });
    StudyFocusSession.hasMany(models.StudyFocusBlock, {
        foreignKey: 'session_id',
        as: 'blocks',
    });
};

module.exports = StudyFocusSession;
