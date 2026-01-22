const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ShoppingList = sequelize.define('ShoppingList', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_purchased: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'MEDIUM',
        allowNull: false
    },
    estimated_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'shopping_lists',
    timestamps: true,
    underscored: true
});

ShoppingList.associate = (models) => {
    ShoppingList.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = ShoppingList;
