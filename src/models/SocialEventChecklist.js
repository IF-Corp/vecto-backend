const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialEventChecklist = sequelize.define(
    'SocialEventChecklist',
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
        item: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'social_event_checklist',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
    }
);

module.exports = SocialEventChecklist;
