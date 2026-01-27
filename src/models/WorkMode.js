const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkMode = sequelize.define('WorkMode', {
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '🎯',
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    suggestedDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        field: 'suggested_duration',
    },
    minDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'min_duration',
    },
    maxDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_duration',
    },
    notificationLevel: {
        type: DataTypes.ENUM('silent', 'minimal', 'normal'),
        allowNull: false,
        defaultValue: 'minimal',
        field: 'notification_level',
    },
    breakDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        field: 'break_duration',
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
    },
    isSystem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_system',
    },
    color: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    tableName: 'work_modes',
    underscored: true,
    timestamps: true,
});

WorkMode.associate = (models) => {
    WorkMode.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });
    WorkMode.hasMany(models.WorkModeSession, {
        foreignKey: 'modeId',
        as: 'sessions',
    });
};

WorkMode.DEFAULT_MODES = [
    {
        name: 'Deep Work',
        icon: '🎯',
        description: 'Foco intenso em tarefas complexas',
        suggestedDuration: 50,
        minDuration: 50,
        maxDuration: 90,
        notificationLevel: 'silent',
        breakDuration: 10,
        color: '#ef4444',
    },
    {
        name: 'Admin Time',
        icon: '📧',
        description: 'Emails, mensagens e tarefas administrativas',
        suggestedDuration: 30,
        minDuration: 30,
        maxDuration: 60,
        notificationLevel: 'normal',
        breakDuration: 5,
        color: '#3b82f6',
    },
    {
        name: 'Meetings',
        icon: '🤝',
        description: 'Reunioes e calls',
        suggestedDuration: 60,
        minDuration: 15,
        maxDuration: 120,
        notificationLevel: 'normal',
        breakDuration: 10,
        color: '#22c55e',
    },
    {
        name: 'Creative',
        icon: '💡',
        description: 'Brainstorming e trabalho criativo',
        suggestedDuration: 45,
        minDuration: 45,
        maxDuration: 90,
        notificationLevel: 'minimal',
        breakDuration: 15,
        color: '#a855f7',
    },
    {
        name: 'Maintenance',
        icon: '🔧',
        description: 'Bugs, refatoracao e manutencao',
        suggestedDuration: 30,
        minDuration: 30,
        maxDuration: 60,
        notificationLevel: 'minimal',
        breakDuration: 5,
        color: '#f97316',
    },
];

module.exports = WorkMode;
