const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyBook = sequelize.define('StudyBook', {
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
    title: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING(300),
        allowNull: true,
    },
    total_pages: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_page: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    format: {
        type: DataTypes.ENUM('PHYSICAL', 'KINDLE', 'PDF', 'AUDIOBOOK_ONLY'),
        allowNull: false,
        defaultValue: 'PHYSICAL',
    },
    has_audiobook: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    cover_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'study_subjects',
            key: 'id',
        },
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
}, {
    tableName: 'study_books',
    timestamps: true,
    underscored: true,
});

StudyBook.associate = (models) => {
    StudyBook.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyBook.belongsTo(models.StudySubject, {
        foreignKey: 'subject_id',
        as: 'subject',
    });
    StudyBook.belongsTo(models.StudyProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
    StudyBook.hasMany(models.StudyProgressLog, {
        foreignKey: 'resource_id',
        as: 'progressLogs',
        constraints: false,
        scope: {
            resource_type: 'BOOK',
        },
    });
};

module.exports = StudyBook;
