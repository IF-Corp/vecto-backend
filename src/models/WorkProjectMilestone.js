const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkProjectMilestone = sequelize.define('WorkProjectMilestone', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'work_project_milestones',
    timestamps: true,
    underscored: true,
});

WorkProjectMilestone.associate = (models) => {
    WorkProjectMilestone.belongsTo(models.WorkProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
};

module.exports = WorkProjectMilestone;
