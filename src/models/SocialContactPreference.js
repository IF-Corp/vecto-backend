const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialContactPreference = sequelize.define(
    'SocialContactPreference',
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
        preference_type: {
            type: DataTypes.ENUM('FOOD', 'DRINK', 'TEAM', 'HOBBY', 'OTHER'),
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: 'social_contact_preferences',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialContactPreference;
