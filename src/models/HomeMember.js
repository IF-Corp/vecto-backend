const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeMember = sequelize.define('HomeMember', {
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    profile: {
        type: DataTypes.ENUM('ADULT', 'TEENAGER', 'CHILD', 'ELDERLY', 'NO_PARTICIPATION'),
        allowNull: false,
        defaultValue: 'ADULT',
    },
    avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'home_members',
    timestamps: true,
    underscored: true,
});

HomeMember.associate = (models) => {
    HomeMember.belongsTo(models.HomeSpace, {
        foreignKey: 'space_id',
        as: 'space',
    });
};

module.exports = HomeMember;
