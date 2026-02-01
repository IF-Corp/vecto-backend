const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const HomeTask = sequelize.define('HomeTask', {
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    room: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    frequency_type: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM'),
        allowNull: false,
        defaultValue: 'WEEKLY',
    },
    frequency_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    frequency_days: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
    },
    specific_days: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    custom_interval_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    assigned_member_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    is_rotation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    rotation_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    rotation_members: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
    },
    preferred_time: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    estimated_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    current_streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    best_streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'home_tasks',
    timestamps: true,
    underscored: true,
});

HomeTask.associate = (models) => {
    HomeTask.belongsTo(models.HomeSpace, {
        foreignKey: 'space_id',
        as: 'space',
    });
    HomeTask.belongsTo(models.HomeMember, {
        foreignKey: 'assigned_member_id',
        as: 'assignedMember',
    });
    HomeTask.hasMany(models.HomeTaskOccurrence, {
        foreignKey: 'task_id',
        as: 'occurrences',
    });
};

module.exports = HomeTask;
