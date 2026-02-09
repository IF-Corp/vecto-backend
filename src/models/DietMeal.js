const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DietMeal = sequelize.define('DietMeal', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    diet_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'diets',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    meal_type: {
        type: DataTypes.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
        allowNull: true
    },
    meal_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    protein: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    carbs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    fat: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    meal_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'diet_meals',
    timestamps: true,
    underscored: true
});

DietMeal.associate = (models) => {
    DietMeal.belongsTo(models.Diet, {
        foreignKey: 'diet_id',
        as: 'diet'
    });
};

module.exports = DietMeal;
