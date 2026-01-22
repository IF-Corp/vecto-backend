const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MealLog = sequelize.define('MealLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    meal_type: {
        type: DataTypes.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    meal_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'meal_logs',
    timestamps: true,
    underscored: true
});

MealLog.associate = (models) => {
    MealLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = MealLog;
