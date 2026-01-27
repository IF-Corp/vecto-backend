const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudySubject = sequelize.define('StudySubject', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    period_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_periods',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    professor: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#3B82F6',
    },
    target_grade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'DROPPED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
    final_grade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
}, {
    tableName: 'study_subjects',
    timestamps: true,
    underscored: true,
});

StudySubject.associate = (models) => {
    StudySubject.belongsTo(models.StudyPeriod, {
        foreignKey: 'period_id',
        as: 'period',
    });
    StudySubject.hasMany(models.StudySubjectWeight, {
        foreignKey: 'subject_id',
        as: 'weights',
    });
    StudySubject.hasMany(models.StudyEvaluation, {
        foreignKey: 'subject_id',
        as: 'evaluations',
    });
    StudySubject.hasMany(models.StudyTopic, {
        foreignKey: 'parent_id',
        as: 'topics',
        constraints: false,
        scope: {
            parent_type: 'SUBJECT',
        },
    });
};

module.exports = StudySubject;
