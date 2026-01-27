const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyProjectMilestone = sequelize.define('StudyProjectMilestone', {
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
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    target_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    order_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'study_project_milestones',
    timestamps: true,
    underscored: true,
});

StudyProjectMilestone.associate = (models) => {
    StudyProjectMilestone.belongsTo(models.StudyProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
};

module.exports = StudyProjectMilestone;
