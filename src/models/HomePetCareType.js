const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomePetCareType = sequelize.define(
    'HomePetCareType',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        pet_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        care_type: {
            type: DataTypes.ENUM('VACCINE', 'DEWORMING', 'BATH', 'VET_CHECKUP', 'GROOMING', 'MEDICATION', 'OTHER'),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        frequency_days: {
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
        tableName: 'home_pet_care_types',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomePetCareType;
