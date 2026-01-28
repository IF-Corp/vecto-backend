const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeSpace = sequelize.define('HomeSpace', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('HOUSE', 'APARTMENT', 'STUDIO', 'ROOM', 'OTHER'),
        allowNull: false,
        defaultValue: 'APARTMENT',
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'home_spaces',
    timestamps: true,
    underscored: true,
});

HomeSpace.associate = (models) => {
    HomeSpace.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    HomeSpace.hasMany(models.HomeSpaceModule, {
        foreignKey: 'space_id',
        as: 'modules',
    });
    HomeSpace.hasMany(models.HomeMember, {
        foreignKey: 'space_id',
        as: 'members',
    });
};

module.exports = HomeSpace;
