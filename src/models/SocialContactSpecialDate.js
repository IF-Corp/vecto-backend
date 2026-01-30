const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialContactSpecialDate = sequelize.define(
    'SocialContactSpecialDate',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        contact_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        date_type: {
            type: DataTypes.ENUM('BIRTHDAY', 'WEDDING', 'GRADUATION', 'ANNIVERSARY', 'OTHER'),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        remind_yearly: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'social_contact_special_dates',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialContactSpecialDate;
