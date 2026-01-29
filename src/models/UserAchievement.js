const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserAchievement = sequelize.define('UserAchievement', {
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
    achievement_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    unlocked_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'user_achievements',
    timestamps: true,
    underscored: true
});

UserAchievement.associate = (models) => {
    UserAchievement.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    UserAchievement.belongsTo(models.Achievement, {
        foreignKey: 'achievement_id',
        as: 'achievement'
    });
};

module.exports = UserAchievement;
