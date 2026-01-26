const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const InvestmentHistory = sequelize.define('InvestmentHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    investment_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    value: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
}, {
    tableName: 'investment_history',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['investment_id', 'date']
        }
    ]
});

InvestmentHistory.associate = (models) => {
    InvestmentHistory.belongsTo(models.Investment, {
        foreignKey: 'investment_id',
        as: 'investment'
    });
};

module.exports = InvestmentHistory;
