const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeMeal = sequelize.define(
    'HomeMeal',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        meal_plan_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        day_of_week: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        meal_type: {
            type: DataTypes.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recipe_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        tableName: 'home_meals',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeMeal;
