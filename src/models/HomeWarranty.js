const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeWarranty = sequelize.define('HomeWarranty', {
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
    item_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    model: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    purchase_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    warranty_until: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    receipt_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'home_warranties',
    timestamps: true,
    underscored: true,
});

HomeWarranty.associate = (models) => {
    HomeWarranty.belongsTo(models.HomeSpace, {
        foreignKey: 'space_id',
        as: 'space',
    });
};

module.exports = HomeWarranty;
