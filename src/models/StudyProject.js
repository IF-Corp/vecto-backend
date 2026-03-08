const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyProject = sequelize.define(
    'StudyProject',
    {
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
        template_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'study_project_templates',
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
        project_type: {
            type: DataTypes.ENUM('CUSTOM', 'CERTIFICATION', 'SKILL', 'CAREER', 'EXAM'),
            allowNull: true,
            defaultValue: 'CUSTOM',
        },
        goal: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(7),
            allowNull: true,
            defaultValue: '#3B82F6',
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        target_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PLANNING',
        },
        progress_percentage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'study_projects',
        timestamps: true,
        underscored: true,
    },
);

StudyProject.associate = (models) => {
    StudyProject.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyProject.belongsTo(models.StudyProjectTemplate, {
        foreignKey: 'template_id',
        as: 'template',
    });
    StudyProject.hasMany(models.StudyProjectResource, {
        foreignKey: 'project_id',
        as: 'resources',
    });
    StudyProject.hasMany(models.StudyProjectMilestone, {
        foreignKey: 'project_id',
        as: 'milestones',
    });
    StudyProject.hasMany(models.StudyBook, {
        foreignKey: 'project_id',
        as: 'books',
    });
    StudyProject.hasMany(models.StudyCourseOnline, {
        foreignKey: 'project_id',
        as: 'coursesOnline',
    });
};

module.exports = StudyProject;
