const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkProject = sequelize.define('WorkProject', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    client_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    client: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '#6366f1',
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    budget_hours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    budget_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    is_billable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'work_projects',
    timestamps: true,
    underscored: true,
});

WorkProject.associate = (models) => {
    WorkProject.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkProject.belongsTo(models.WorkClient, {
        foreignKey: 'client_id',
        as: 'clientRef',
    });
    WorkProject.hasMany(models.WorkTask, {
        foreignKey: 'project_id',
        as: 'tasks',
    });
    WorkProject.hasMany(models.WorkTimeEntry, {
        foreignKey: 'project_id',
        as: 'timeEntries',
    });
    WorkProject.hasMany(models.WorkProjectMember, {
        foreignKey: 'project_id',
        as: 'members',
    });
    WorkProject.hasMany(models.WorkProjectMilestone, {
        foreignKey: 'project_id',
        as: 'milestones',
    });
};

module.exports = WorkProject;
