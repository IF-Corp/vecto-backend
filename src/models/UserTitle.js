const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserTitle = sequelize.define('UserTitle', {
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
    title_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    unlocked_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'user_titles',
    timestamps: true,
    underscored: true
});

UserTitle.associate = (models) => {
    UserTitle.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    UserTitle.belongsTo(models.Title, {
        foreignKey: 'title_id',
        as: 'title'
    });
};

module.exports = UserTitle;
