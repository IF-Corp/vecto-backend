const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialCircle = sequelize.define(
    'SocialCircle',
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
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
            allowNull: false,
            defaultValue: 'MEDIUM',
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'social_circles',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialCircle;
