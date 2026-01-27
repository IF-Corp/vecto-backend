const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkKeyResult = sequelize.define('WorkKeyResult', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    objective_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    metric_type: {
        type: DataTypes.ENUM('NUMERIC', 'PERCENTAGE', 'BINARY'),
        allowNull: false,
        defaultValue: 'NUMERIC',
    },
    start_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    target_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    current_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    unit: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'work_key_results',
    timestamps: true,
    underscored: true,
});

WorkKeyResult.associate = (models) => {
    WorkKeyResult.belongsTo(models.WorkObjective, {
        foreignKey: 'objective_id',
        as: 'objective',
    });
    WorkKeyResult.hasMany(models.WorkKeyResultUpdate, {
        foreignKey: 'key_result_id',
        as: 'updates',
    });
};

// Calculate progress based on metric type
WorkKeyResult.calculateProgress = function(startValue, targetValue, currentValue, metricType) {
    if (metricType === 'BINARY') {
        return currentValue >= 1 ? 100 : 0;
    }

    const range = targetValue - startValue;
    if (range === 0) return currentValue >= targetValue ? 100 : 0;

    const progress = ((currentValue - startValue) / range) * 100;
    return Math.min(100, Math.max(0, progress));
};

module.exports = WorkKeyResult;
