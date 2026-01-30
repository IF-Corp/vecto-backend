const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialContact = sequelize.define(
    'SocialContact',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        photo_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'social_contacts',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialContact;
