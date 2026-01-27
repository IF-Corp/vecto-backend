const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyFlashcard = sequelize.define('StudyFlashcard', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    deck_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_decks',
            key: 'id',
        },
    },
    front: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    back: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.ENUM('NEW', 'LEARNING', 'REVIEW', 'RELEARNING'),
        allowNull: false,
        defaultValue: 'NEW',
    },
    next_review_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    interval_days: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
    },
    ease_factor: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        defaultValue: 2.5,
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    lapses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    stability: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
    },
    retrievability: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true,
    },
    last_review_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'study_flashcards',
    timestamps: true,
    underscored: true,
});

StudyFlashcard.associate = (models) => {
    StudyFlashcard.belongsTo(models.StudyDeck, {
        foreignKey: 'deck_id',
        as: 'deck',
    });
    StudyFlashcard.hasMany(models.StudyReviewLog, {
        foreignKey: 'flashcard_id',
        as: 'reviewLogs',
    });
};

module.exports = StudyFlashcard;
