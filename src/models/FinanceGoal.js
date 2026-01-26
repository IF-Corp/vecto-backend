const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FinanceGoal = sequelize.define('FinanceGoal', {
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true
    },
    target_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    current_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'MEDIUM',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED'),
        defaultValue: 'IN_PROGRESS',
        allowNull: false
    }
}, {
    tableName: 'finance_goals',
    timestamps: true,
    underscored: true
});

FinanceGoal.associate = (models) => {
    FinanceGoal.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    FinanceGoal.hasMany(models.GoalContribution, {
        foreignKey: 'goal_id',
        as: 'contributions'
    });
};

module.exports = FinanceGoal;
