const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Investment = sequelize.define('Investment', {
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
        type: DataTypes.STRING(150),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(
            // Fixed income
            'CDB', 'LCI', 'LCA', 'TESOURO_SELIC', 'TESOURO_IPCA', 'TESOURO_PREFIXADO', 'POUPANCA',
            // Variable income
            'ACAO', 'FII', 'ETF', 'BDR', 'CRIPTO',
            // Others
            'FUNDO_INVESTIMENTO', 'PREVIDENCIA', 'OTHER'
        ),
        allowNull: false
    },
    institution: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    initial_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    current_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    // For fixed income
    rate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: true
    },
    rate_type: {
        type: DataTypes.ENUM('CDI', 'IPCA', 'PREFIXADO', 'SELIC', 'OTHER'),
        allowNull: true
    },
    maturity_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    // For variable income
    ticker: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    quantity: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: true
    },
    average_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: 'investments',
    timestamps: true,
    underscored: true
});

Investment.associate = (models) => {
    Investment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Investment.hasMany(models.InvestmentHistory, {
        foreignKey: 'investment_id',
        as: 'history'
    });
};

module.exports = Investment;
