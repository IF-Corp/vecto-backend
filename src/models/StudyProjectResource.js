const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyProjectResource = sequelize.define('StudyProjectResource', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_projects',
            key: 'id',
        },
    },
    resource_type: {
        type: DataTypes.ENUM('BOOK', 'COURSE_ONLINE', 'SUBJECT', 'DECK'),
        allowNull: false,
    },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    order_index: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    tableName: 'study_project_resources',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

StudyProjectResource.associate = (models) => {
    StudyProjectResource.belongsTo(models.StudyProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
};

module.exports = StudyProjectResource;
