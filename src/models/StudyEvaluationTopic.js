const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyEvaluationTopic = sequelize.define('StudyEvaluationTopic', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    evaluation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_evaluations',
            key: 'id',
        },
    },
    topic_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_topics',
            key: 'id',
        },
    },
}, {
    tableName: 'study_evaluation_topics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

module.exports = StudyEvaluationTopic;
