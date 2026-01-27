const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyDeck = sequelize.define('StudyDeck', {
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
    name: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#3B82F6',
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_subjects',
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
    cards_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'study_decks',
    timestamps: true,
    underscored: true,
});

StudyDeck.associate = (models) => {
    StudyDeck.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyDeck.belongsTo(models.StudySubject, {
        foreignKey: 'subject_id',
        as: 'subject',
    });
    StudyDeck.belongsTo(models.StudyTopic, {
        foreignKey: 'topic_id',
        as: 'topic',
    });
    StudyDeck.hasMany(models.StudyFlashcard, {
        foreignKey: 'deck_id',
        as: 'flashcards',
    });
};

module.exports = StudyDeck;
