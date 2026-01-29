const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FreezeModule = sequelize.define('FreezeModule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    freeze_period_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    module_type: {
        type: DataTypes.ENUM('HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES', 'WORK', 'SOCIAL', 'HOME'),
        allowNull: false
    }
}, {
    tableName: 'freeze_modules',
    timestamps: true,
    underscored: true
});

FreezeModule.associate = (models) => {
    FreezeModule.belongsTo(models.FreezePeriod, {
        foreignKey: 'freeze_period_id',
        as: 'freezePeriod'
    });
};

module.exports = FreezeModule;
