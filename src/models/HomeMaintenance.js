const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeMaintenance = sequelize.define('HomeMaintenance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    space_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    frequency_type: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'),
        allowNull: false,
        defaultValue: 'MONTHLY',
    },
    frequency_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    last_done_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    next_due_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estimated_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    reminder_days_before: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'home_maintenances',
    timestamps: true,
    underscored: true,
});

HomeMaintenance.associate = (models) => {
    HomeMaintenance.belongsTo(models.HomeSpace, {
        foreignKey: 'space_id',
        as: 'space',
    });
};

module.exports = HomeMaintenance;
