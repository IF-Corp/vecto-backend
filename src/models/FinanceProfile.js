const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FinanceProfile = sequelize.define('FinanceProfile', {
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
    investor_profile: {
        type: DataTypes.ENUM('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'),
        defaultValue: 'MODERATE',
        allowNull: false
    },
    budget_fixed_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
        allowNull: false,
        validate: { min: 0, max: 100 }
    },
    budget_flex_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
        allowNull: false,
        validate: { min: 0, max: 100 }
    },
    budget_invest_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 20,
        allowNull: false,
        validate: { min: 0, max: 100 }
    },
    monthly_income: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    alerts_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    weekly_report_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'finance_profiles',
    timestamps: true,
    underscored: true
});

FinanceProfile.associate = (models) => {
    FinanceProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = FinanceProfile;
