const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkKeyResultUpdate = sequelize.define('WorkKeyResultUpdate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    key_result_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    previous_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    new_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'work_key_result_updates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

WorkKeyResultUpdate.associate = (models) => {
    WorkKeyResultUpdate.belongsTo(models.WorkKeyResult, {
        foreignKey: 'key_result_id',
        as: 'keyResult',
    });
};

module.exports = WorkKeyResultUpdate;
