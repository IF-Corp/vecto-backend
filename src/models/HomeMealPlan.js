const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeMealPlan = sequelize.define(
    'HomeMealPlan',
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
        week_start: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'home_meal_plans',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeMealPlan;
