const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HealthProfile = sequelize.define('HealthProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    sex: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
    },
    height_cm: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: true,
        validate: {
            min: 50,
            max: 300,
        },
    },
    activity_level: {
        type: DataTypes.ENUM('sedentary', 'light', 'moderate', 'active', 'very_active'),
        allowNull: true,
        defaultValue: 'moderate',
    },
}, {
    tableName: 'health_profiles',
    timestamps: true,
    underscored: true,
});

HealthProfile.associate = (models) => {
    HealthProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = HealthProfile;
