const { sequelize, DataTypes } = require('../config/database');

const UserModule = sequelize.define('UserModule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    moduleType: {
        type: DataTypes.ENUM('HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES', 'WORK', 'SOCIAL', 'HOME'),
        allowNull: false,
        field: 'module_type',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
}, {
    tableName: 'user_modules',
    timestamps: true,
    underscored: true,
});

module.exports = UserModule;
