const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialContactProfessional = sequelize.define(
    'SocialContactProfessional',
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
        company: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        job_title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        industry: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        how_we_met: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        mutual_connections: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        potential_collaboration: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'social_contact_professional',
        timestamps: true,
        underscored: true,
    }
);

module.exports = SocialContactProfessional;
