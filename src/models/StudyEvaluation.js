const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyEvaluation = sequelize.define('StudyEvaluation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_subjects',
            key: 'id',
        },
    },
    evaluation_type: {
        type: DataTypes.ENUM('EXAM_1', 'EXAM_2', 'EXAM_3', 'FINAL_EXAM', 'ASSIGNMENT', 'PROJECT', 'PARTICIPATION', 'OTHER'),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    grade: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    max_grade: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 10.0,
    },
    status: {
        type: DataTypes.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'SCHEDULED',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'study_evaluations',
    timestamps: true,
    underscored: true,
});

StudyEvaluation.associate = (models) => {
    StudyEvaluation.belongsTo(models.StudySubject, {
        foreignKey: 'subject_id',
        as: 'subject',
    });
    StudyEvaluation.hasOne(models.StudyEvaluationFeedback, {
        foreignKey: 'evaluation_id',
        as: 'feedback',
    });
    StudyEvaluation.belongsToMany(models.StudyTopic, {
        through: models.StudyEvaluationTopic,
        foreignKey: 'evaluation_id',
        otherKey: 'topic_id',
        as: 'topics',
    });
};

module.exports = StudyEvaluation;
