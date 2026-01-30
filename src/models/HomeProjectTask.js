const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeProjectTask = sequelize.define(
    'HomeProjectTask',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        project_id: {
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
        estimated_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        actual_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        finance_transaction_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        tableName: 'home_project_tasks',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeProjectTask;
