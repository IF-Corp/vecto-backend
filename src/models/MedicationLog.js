const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MedicationLog = sequelize.define('MedicationLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    medication_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    taken_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('TAKEN', 'SKIPPED', 'MISSED'),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'medication_logs',
    timestamps: true,
    underscored: true
});

MedicationLog.associate = (models) => {
    MedicationLog.belongsTo(models.Medication, {
        foreignKey: 'medication_id',
        as: 'medication'
    });
};

module.exports = MedicationLog;
