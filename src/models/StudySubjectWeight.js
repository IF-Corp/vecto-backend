const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudySubjectWeight = sequelize.define('StudySubjectWeight', {
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
    weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
}, {
    tableName: 'study_subject_weights',
    timestamps: true,
    underscored: true,
});

StudySubjectWeight.associate = (models) => {
    StudySubjectWeight.belongsTo(models.StudySubject, {
        foreignKey: 'subject_id',
        as: 'subject',
    });
};

module.exports = StudySubjectWeight;
