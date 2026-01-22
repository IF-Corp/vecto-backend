const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    is_onboarded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

User.associate = (models) => {
    User.hasOne(models.UserPreferences, {
        foreignKey: 'user_id',
        as: 'preferences'
    });
    User.hasOne(models.OnboardingState, {
        foreignKey: 'user_id',
        as: 'onboardingState'
    });
    User.hasMany(models.GlobalCategory, {
        foreignKey: 'user_id',
        as: 'categories'
    });
    User.hasMany(models.NotificationConfig, {
        foreignKey: 'user_id',
        as: 'notificationConfigs'
    });
};

module.exports = User;
