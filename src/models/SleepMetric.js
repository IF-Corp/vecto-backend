const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SleepMetric = sequelize.define('SleepMetric', {
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
    sleep_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    bedtime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    wake_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quality_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        }
    },
    deep_sleep_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rem_sleep_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    interruptions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'sleep_metrics',
    timestamps: true,
    underscored: true
});

SleepMetric.associate = (models) => {
    SleepMetric.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = SleepMetric;
