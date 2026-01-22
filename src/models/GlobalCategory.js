const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GlobalCategory = sequelize.define('GlobalCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color_hex: {
        type: DataTypes.STRING(7),
        allowNull: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('TAG', 'CONTEXT', 'AREA'),
        allowNull: false,
        defaultValue: 'TAG'
    }
}, {
    tableName: 'global_categories',
    timestamps: true,
    underscored: true
});

GlobalCategory.associate = (models) => {
    GlobalCategory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = GlobalCategory;
