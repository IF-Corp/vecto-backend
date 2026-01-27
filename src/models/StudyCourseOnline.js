const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyCourseOnline = sequelize.define('StudyCourseOnline', {
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
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    instructor: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    modality: {
        type: DataTypes.ENUM('ONLINE', 'IN_PERSON', 'HYBRID'),
        allowNull: false,
        defaultValue: 'ONLINE',
    },
    category: {
        type: DataTypes.ENUM('EXTRACURRICULAR', 'CERTIFICATION', 'EXTENSION', 'FREE'),
        allowNull: false,
        defaultValue: 'EXTRACURRICULAR',
    },
    total_lessons: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_lesson: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    total_hours: {
        type: DataTypes.DECIMAL(6, 1),
        allowNull: true,
    },
    cover_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_projects',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'),
        allowNull: false,
        defaultValue: 'NOT_STARTED',
    },
    rating: {
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
    started_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    finished_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    certificate_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
}, {
    tableName: 'study_courses_online',
    timestamps: true,
    underscored: true,
});

StudyCourseOnline.associate = (models) => {
    StudyCourseOnline.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyCourseOnline.belongsTo(models.StudyProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
    StudyCourseOnline.hasMany(models.StudyProgressLog, {
        foreignKey: 'resource_id',
        as: 'progressLogs',
        constraints: false,
        scope: {
            resource_type: 'COURSE_ONLINE',
        },
    });
};

module.exports = StudyCourseOnline;
