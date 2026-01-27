const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkClient = sequelize.define('WorkClient', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    contact_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    contract_status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PROSPECTING'),
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
    payment_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    communication_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    scope_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'work_clients',
    timestamps: true,
    underscored: true,
});

WorkClient.associate = (models) => {
    WorkClient.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkClient.hasMany(models.WorkProject, {
        foreignKey: 'client_id',
        as: 'projects',
    });
};

module.exports = WorkClient;
