const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeShoppingItem = sequelize.define('HomeShoppingItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    list_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    estimated_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    is_purchased: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    purchased_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    added_by_member_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'home_shopping_items',
    timestamps: true,
    underscored: true,
});

HomeShoppingItem.associate = (models) => {
    HomeShoppingItem.belongsTo(models.HomeShoppingList, {
        foreignKey: 'list_id',
        as: 'list',
    });
    HomeShoppingItem.belongsTo(models.HomeMember, {
        foreignKey: 'added_by_member_id',
        as: 'addedBy',
    });
};

module.exports = HomeShoppingItem;
