const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomePlantCareLog = sequelize.define(
    'HomePlantCareLog',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        care_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        done_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        done_by_member_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'home_plant_care_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = HomePlantCareLog;
