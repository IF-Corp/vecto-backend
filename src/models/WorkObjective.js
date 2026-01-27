const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkObjective = sequelize.define('WorkObjective', {
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
    period_type: {
        type: DataTypes.ENUM('QUARTERLY', 'SEMESTER', 'YEARLY', 'CUSTOM'),
        allowNull: false,
        defaultValue: 'QUARTERLY',
    },
    period_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    period_end: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    area: {
        type: DataTypes.ENUM('CAREER', 'PROJECT', 'COMPANY', 'PERSONAL'),
        allowNull: false,
        defaultValue: 'CAREER',
    },
    status: {
        type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'DRAFT',
    },
    progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'work_objectives',
    timestamps: true,
    underscored: true,
});

WorkObjective.associate = (models) => {
    WorkObjective.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkObjective.hasMany(models.WorkKeyResult, {
        foreignKey: 'objective_id',
        as: 'keyResults',
    });
};

module.exports = WorkObjective;
