const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyTopic = sequelize.define('StudyTopic', {
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
    difficulty: {
        type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD', 'VERY_HARD'),
        allowNull: true,
    },
    retention_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    parent_type: {
        type: DataTypes.ENUM('SUBJECT', 'BOOK', 'COURSE_ONLINE', 'PROJECT'),
        allowNull: true,
    },
    parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('TO_LEARN', 'IN_PROGRESS', 'NEEDS_REVIEW', 'MASTERED'),
        allowNull: false,
        defaultValue: 'TO_LEARN',
    },
    last_reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'study_topics',
    timestamps: true,
    underscored: true,
});

StudyTopic.associate = (models) => {
    StudyTopic.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyTopic.hasMany(models.StudyRetentionLog, {
        foreignKey: 'topic_id',
        as: 'retentionLogs',
    });
    StudyTopic.belongsToMany(models.StudyEvaluation, {
        through: models.StudyEvaluationTopic,
        foreignKey: 'topic_id',
        otherKey: 'evaluation_id',
        as: 'evaluations',
    });
};

module.exports = StudyTopic;
