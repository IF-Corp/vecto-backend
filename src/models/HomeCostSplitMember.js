const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeCostSplitMember = sequelize.define(
    'HomeCostSplitMember',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        split_settings_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'home_cost_split_settings',
                key: 'id',
            },
        },
        member_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'home_members',
                key: 'id',
            },
        },
        percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'home_cost_split_members',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeCostSplitMember;
