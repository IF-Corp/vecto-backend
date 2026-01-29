const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialContactRestriction = sequelize.define(
    'SocialContactRestriction',
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
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: 'social_contact_restrictions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialContactRestriction;
