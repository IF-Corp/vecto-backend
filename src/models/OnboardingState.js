const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const OnboardingState = sequelize.define('OnboardingState', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    current_step: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selected_modules: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false
    }
}, {
    tableName: 'onboarding_state',
    timestamps: true,
    underscored: true
});

OnboardingState.associate = (models) => {
    OnboardingState.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = OnboardingState;
