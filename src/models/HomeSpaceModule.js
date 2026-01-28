const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeSpaceModule = sequelize.define('HomeSpaceModule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    space_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    module_type: {
        type: DataTypes.ENUM('ROUTINE', 'MAINTENANCE', 'SHOPPING', 'STOCK', 'PLANTS', 'PETS', 'MEALS', 'PROJECTS'),
        allowNull: false,
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    settings: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'home_space_modules',
    timestamps: true,
    underscored: true,
});

HomeSpaceModule.associate = (models) => {
    HomeSpaceModule.belongsTo(models.HomeSpace, {
        foreignKey: 'space_id',
        as: 'space',
    });
};

module.exports = HomeSpaceModule;
