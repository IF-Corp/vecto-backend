const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SocialGroup = sequelize.define('SocialGroup', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ranking_logic: {
        type: DataTypes.ENUM('POINTS', 'STREAK'),
        defaultValue: 'POINTS',
        allowNull: false
    }
}, {
    tableName: 'social_groups',
    timestamps: true,
    underscored: true
});

SocialGroup.associate = (models) => {
    SocialGroup.belongsToMany(models.User, {
        through: models.GroupMember,
        foreignKey: 'group_id',
        otherKey: 'user_id',
        as: 'members'
    });
};

module.exports = SocialGroup;
