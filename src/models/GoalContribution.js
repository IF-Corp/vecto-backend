const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GoalContribution = sequelize.define('GoalContribution', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    goal_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING(200),
        allowNull: true
    }
}, {
    tableName: 'goal_contributions',
    timestamps: true,
    underscored: true
});

GoalContribution.associate = (models) => {
    GoalContribution.belongsTo(models.FinanceGoal, {
        foreignKey: 'goal_id',
        as: 'goal'
    });
};

module.exports = GoalContribution;
