const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeProject = sequelize.define(
    'HomeProject',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        space_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        budget: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        deadline: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PLANNING',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'home_projects',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeProject;
