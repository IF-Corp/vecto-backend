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
    profile_type: {
        type: DataTypes.ENUM('ADULT', 'TEENAGER', 'CHILD', 'ELDERLY', 'NO_PARTICIPATION'),
        allowNull: false,
        defaultValue: 'ADULT',
    },
    avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    linked_user_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    participates_tasks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    participates_costs: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    task_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
