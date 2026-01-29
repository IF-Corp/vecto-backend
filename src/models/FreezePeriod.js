const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const FreezePeriod = sequelize.define('FreezePeriod', {
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
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    reason: {
        type: DataTypes.ENUM('VACATION', 'TRAVEL', 'ILLNESS', 'INTENSE_PROJECT', 'MENTAL_REST', 'OTHER'),
        allowNull: true
    },
    reason_custom: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'SCHEDULED'
    },
    activated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deactivated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'freeze_periods',
    timestamps: true,
    underscored: true
});

FreezePeriod.associate = (models) => {
    FreezePeriod.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    FreezePeriod.hasMany(models.FreezeModule, {
        foreignKey: 'freeze_period_id',
        as: 'modules'
    });
    FreezePeriod.hasOne(models.FreezeOptions, {
        foreignKey: 'freeze_period_id',
        as: 'options'
    });
};

module.exports = FreezePeriod;
