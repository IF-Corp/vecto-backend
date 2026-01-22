const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Account = sequelize.define('Account', {
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
    type: {
        type: DataTypes.ENUM('CREDIT', 'DEBIT', 'CASH', 'INVESTMENT'),
        allowNull: false
    },
    total_limit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    closing_day: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    due_day: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'accounts',
    timestamps: true,
    underscored: true
});

Account.associate = (models) => {
    Account.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Account.hasMany(models.Transaction, {
        foreignKey: 'account_id',
        as: 'transactions'
    });
};

module.exports = Account;
