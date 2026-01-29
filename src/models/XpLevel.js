const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const XpLevel = sequelize.define('XpLevel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    min_xp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max_xp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
    tableName: 'xp_levels',
    timestamps: true,
    underscored: true
});

module.exports = XpLevel;
