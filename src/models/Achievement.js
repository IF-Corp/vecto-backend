const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Achievement = sequelize.define('Achievement', {
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
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM(
            'HABITS',
            'TASKS',
            'FINANCE',
            'HEALTH',
            'STUDIES',
            'WORK',
            'SOCIAL',
            'HOME',
            'GENERAL',
            'STREAK',
            'MILESTONES'
        ),
        allowNull: false
    },
    rarity: {
        type: DataTypes.ENUM('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'),
        allowNull: false,
        defaultValue: 'COMMON'
    },
    icon: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    xp_reward: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50
    },
    condition_type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    condition_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'achievements',
    timestamps: true,
    underscored: true
});

Achievement.associate = (models) => {
    Achievement.hasMany(models.UserAchievement, {
        foreignKey: 'achievement_id',
        as: 'userAchievements'
    });
};

module.exports = Achievement;
