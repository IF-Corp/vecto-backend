const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyEvaluationFeedback = sequelize.define('StudyEvaluationFeedback', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    evaluation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'study_evaluations',
            key: 'id',
        },
    },
    difficulty_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    confidence_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    mental_state_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    answered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'study_evaluation_feedback',
    timestamps: true,
    underscored: true,
});

StudyEvaluationFeedback.associate = (models) => {
    StudyEvaluationFeedback.belongsTo(models.StudyEvaluation, {
        foreignKey: 'evaluation_id',
        as: 'evaluation',
    });
};

module.exports = StudyEvaluationFeedback;
