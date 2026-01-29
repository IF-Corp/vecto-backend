const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialEventGuest = sequelize.define(
    'SocialEventGuest',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        contact_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('INVITED', 'CONFIRMED', 'MAYBE', 'DECLINED'),
            allowNull: false,
            defaultValue: 'INVITED',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'social_event_guests',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialEventGuest;
