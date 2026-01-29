const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeCostSplitSettings = sequelize.define(
    'HomeCostSplitSettings',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        space_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'home_spaces',
                key: 'id',
            },
        },
        split_type: {
            type: DataTypes.ENUM('EQUAL', 'CUSTOM'),
            allowNull: false,
            defaultValue: 'EQUAL',
        },
    },
    {
        tableName: 'home_cost_split_settings',
        timestamps: true,
        underscored: true,
    }
);

module.exports = HomeCostSplitSettings;
