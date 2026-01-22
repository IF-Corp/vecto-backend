const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Medication = sequelize.define('Medication', {
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
        type: DataTypes.STRING,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    frequency: {
        type: DataTypes.ENUM('ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'AS_NEEDED', 'WEEKLY'),
        allowNull: false
    },
    time_of_day: {
        type: DataTypes.ARRAY(DataTypes.TIME),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'medications',
    timestamps: true,
    underscored: true
});

Medication.associate = (models) => {
    Medication.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Medication.hasMany(models.MedicationLog, {
        foreignKey: 'medication_id',
        as: 'logs'
    });
};

module.exports = Medication;
