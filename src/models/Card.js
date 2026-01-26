const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Card = sequelize.define('Card', {
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
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_digits: {
        type: DataTypes.STRING(4),
        allowNull: false
    },
    brand: {
        type: DataTypes.ENUM('VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER'),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('CREDIT', 'DEBIT', 'BOTH'),
        allowNull: false
    },
    card_limit: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    closing_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 31 }
    },
    due_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 31 }
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'cards',
    timestamps: true,
    underscored: true
});

Card.associate = (models) => {
    Card.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Card.hasMany(models.Transaction, {
        foreignKey: 'card_id',
        as: 'transactions'
    });
    Card.hasMany(models.Invoice, {
        foreignKey: 'card_id',
        as: 'invoices'
    });
};

module.exports = Card;
