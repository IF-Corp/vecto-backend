const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkProjectMember = sequelize.define('WorkProjectMember', {
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
    role: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'work_project_members',
    timestamps: true,
    underscored: true,
});

WorkProjectMember.associate = (models) => {
    WorkProjectMember.belongsTo(models.WorkProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
};

module.exports = WorkProjectMember;
