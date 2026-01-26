const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WeightLog = sequelize.define('WeightLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    weight_kg: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 20,
            max: 500,
        },
    },
    body_fat_percentage: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: true,
        validate: {
            min: 1,
            max: 70,
        },
    },
    muscle_mass_kg: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 10,
            max: 150,
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'weight_logs',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'date'],
            name: 'weight_logs_user_date_unique',
        },
    ],
});

WeightLog.associate = (models) => {
    WeightLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = WeightLog;
