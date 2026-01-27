const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyReviewSession = sequelize.define('StudyReviewSession', {
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
    deck_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_decks',
            key: 'id',
        },
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
    total_cards: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    cards_reviewed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    cards_correct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    score: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'IN_PROGRESS',
    },
}, {
    tableName: 'study_review_sessions',
    timestamps: true,
    underscored: true,
});

StudyReviewSession.associate = (models) => {
    StudyReviewSession.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyReviewSession.belongsTo(models.StudyDeck, {
        foreignKey: 'deck_id',
        as: 'deck',
    });
    StudyReviewSession.hasMany(models.StudyReviewLog, {
        foreignKey: 'session_id',
        as: 'reviewLogs',
    });
};

module.exports = StudyReviewSession;
