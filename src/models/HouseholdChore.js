const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HouseholdChore = sequelize.define('HouseholdChore', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    frequency: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'AS_NEEDED'),
        allowNull: false
    },
    assigned_to: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_completed: {
        type: DataTypes.DATE,
        allowNull: true
    },
    next_due: {
        type: DataTypes.DATE,
        allowNull: true
    },
    room: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'household_chores',
    timestamps: true,
    underscored: true
});

HouseholdChore.associate = (models) => {
    HouseholdChore.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = HouseholdChore;
