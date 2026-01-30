const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialContactCircle = sequelize.define(
    'SocialContactCircle',
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
        circle_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: 'social_contact_circles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialContactCircle;
