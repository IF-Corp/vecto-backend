const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Diet = sequelize.define('Diet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    goal: {
        type: DataTypes.ENUM('LOSE_WEIGHT', 'MAINTAIN', 'GAIN_MUSCLE', 'CUSTOM'),
        allowNull: false
    },
    daily_calories_target: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 500,
            max: 10000
        }
    },
    protein_target: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: true
    },
    carbs_target: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: true
    },
    fat_target: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'diets',
    timestamps: true,
    underscored: true
});

Diet.associate = (models) => {
    Diet.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Diet.hasMany(models.DietMeal, {
        foreignKey: 'diet_id',
        as: 'meals'
    });
};

module.exports = Diet;
