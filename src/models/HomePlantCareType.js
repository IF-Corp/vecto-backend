const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomePlantCareType = sequelize.define(
    'HomePlantCareType',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        plant_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        care_type: {
            type: DataTypes.ENUM('WATER', 'FERTILIZE', 'PRUNE', 'REPOT', 'OTHER'),
            allowNull: false,
        },
        frequency_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 7,
        },
        last_done_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        next_due_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'home_plant_care_types',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomePlantCareType;
