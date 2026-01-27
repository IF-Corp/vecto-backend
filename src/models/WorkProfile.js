const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkProfile = sequelize.define('WorkProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    work_type: {
        type: DataTypes.ENUM('CLT', 'PJ', 'FREELANCER', 'ENTREPRENEUR', 'HYBRID'),
        allowNull: false,
        defaultValue: 'CLT',
    },
    work_model: {
        type: DataTypes.ENUM('IN_PERSON', 'REMOTE', 'HYBRID'),
        allowNull: false,
        defaultValue: 'HYBRID',
    },
    weekly_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 40,
        validate: { min: 1, max: 168 },
    },
    overtime_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: { min: 0, max: 100 },
    },
    has_external_clients: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    week_start_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 0 = Sunday, 1 = Monday
        validate: { min: 0, max: 6 },
    },
}, {
    tableName: 'work_profiles',
    timestamps: true,
    underscored: true,
});

WorkProfile.associate = (models) => {
    WorkProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = WorkProfile;
