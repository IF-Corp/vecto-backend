const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const XpLog = sequelize.define('XpLog', {
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
    xp_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    source: {
        type: DataTypes.ENUM(
            'HABIT_COMPLETE',
            'TASK_COMPLETE',
            'STREAK_BONUS',
            'ACHIEVEMENT',
            'BUDGET_KEPT',
            'STUDY_SESSION',
            'WORKOUT_COMPLETE',
            'FOCUS_SESSION',
            'DAILY_LOGIN',
            'LEVEL_UP_BONUS',
            'OTHER'
        ),
        allowNull: false
    },
    source_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'xp_logs',
    timestamps: true,
    underscored: true
});

XpLog.associate = (models) => {
    XpLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = XpLog;
