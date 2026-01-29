const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserXp = sequelize.define('UserXp', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    total_xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    current_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'user_xp',
    timestamps: true,
    underscored: true
});

UserXp.associate = (models) => {
    UserXp.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = UserXp;
