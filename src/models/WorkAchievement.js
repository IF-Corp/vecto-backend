const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkAchievement = sequelize.define('WorkAchievement', {
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
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    achievement_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Trophy',
    },
}, {
    tableName: 'work_achievements',
    timestamps: true,
    underscored: true,
});

WorkAchievement.associate = (models) => {
    WorkAchievement.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkAchievement.belongsTo(models.WorkProject, {
        foreignKey: 'project_id',
        as: 'project',
    });
};

module.exports = WorkAchievement;
