const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomePet = sequelize.define(
    'HomePet',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        space_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        species: {
            type: DataTypes.ENUM('DOG', 'CAT', 'BIRD', 'FISH', 'RODENT', 'REPTILE', 'OTHER'),
            allowNull: false,
            defaultValue: 'OTHER',
        },
        breed: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        photo_url: {
            type: DataTypes.TEXT,
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
        tableName: 'home_pets',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomePet;
