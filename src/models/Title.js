const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Title = sequelize.define('Title', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rarity: {
        type: DataTypes.ENUM('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'),
        allowNull: false,
        defaultValue: 'COMMON'
    },
    unlock_condition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    required_level: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    required_achievement_id: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'titles',
    timestamps: true,
    underscored: true
});

Title.associate = (models) => {
    Title.belongsTo(models.Achievement, {
        foreignKey: 'required_achievement_id',
        as: 'requiredAchievement'
    });
    Title.hasMany(models.UserTitle, {
        foreignKey: 'title_id',
        as: 'userTitles'
    });
};

module.exports = Title;
