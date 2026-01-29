const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialContactTag = sequelize.define(
    'SocialContactTag',
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
        tag_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        tableName: 'social_contact_tags',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialContactTag;
