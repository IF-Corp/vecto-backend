const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GroupMember = sequelize.define('GroupMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    group_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    current_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    tableName: 'group_members',
    timestamps: true,
    underscored: true
});

GroupMember.associate = (models) => {
    GroupMember.belongsTo(models.SocialGroup, {
        foreignKey: 'group_id',
        as: 'group'
    });
    GroupMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = GroupMember;
