const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HouseholdInventory = sequelize.define('HouseholdInventory', {
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
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    minimum_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    purchase_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'household_inventory',
    timestamps: true,
    underscored: true
});

HouseholdInventory.associate = (models) => {
    HouseholdInventory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = HouseholdInventory;
