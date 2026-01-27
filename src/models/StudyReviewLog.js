const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyReviewLog = sequelize.define('StudyReviewLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_review_sessions',
            key: 'id',
        },
    },
    flashcard_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_flashcards',
            key: 'id',
        },
    },
    response_rating: {
        type: DataTypes.ENUM('AGAIN', 'HARD', 'GOOD', 'EASY'),
        allowNull: false,
    },
    time_spent_seconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reviewed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'study_review_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

StudyReviewLog.associate = (models) => {
    StudyReviewLog.belongsTo(models.StudyReviewSession, {
        foreignKey: 'session_id',
        as: 'session',
    });
    StudyReviewLog.belongsTo(models.StudyFlashcard, {
        foreignKey: 'flashcard_id',
        as: 'flashcard',
    });
};

module.exports = StudyReviewLog;
