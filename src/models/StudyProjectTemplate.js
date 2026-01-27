const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyProjectTemplate = sequelize.define('StudyProjectTemplate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    default_milestones: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
    },
    estimated_duration_weeks: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'study_project_templates',
    timestamps: true,
    underscored: true,
});

StudyProjectTemplate.associate = (models) => {
    StudyProjectTemplate.hasMany(models.StudyProject, {
        foreignKey: 'template_id',
        as: 'projects',
    });
};

module.exports = StudyProjectTemplate;
