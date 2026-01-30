const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeRecipe = sequelize.define(
    'HomeRecipe',
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
        category: {
            type: DataTypes.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT'),
            allowNull: true,
        },
        prep_time_minutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'home_recipes',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeRecipe;
