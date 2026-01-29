const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeShoppingList = sequelize.define('HomeShoppingList', {
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
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    is_recurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    reset_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Day of week (0-6) to reset recurring list',
    },
    created_by_member_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'home_shopping_lists',
    timestamps: true,
    underscored: true,
});

HomeShoppingList.associate = (models) => {
    HomeShoppingList.belongsTo(models.HomeSpace, {
        foreignKey: 'space_id',
        as: 'space',
    });
    HomeShoppingList.belongsTo(models.HomeMember, {
        foreignKey: 'created_by_member_id',
        as: 'createdBy',
    });
    HomeShoppingList.hasMany(models.HomeShoppingItem, {
        foreignKey: 'list_id',
        as: 'items',
    });
};

module.exports = HomeShoppingList;
