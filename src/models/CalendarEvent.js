const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const CalendarEvent = sequelize.define('CalendarEvent', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_all_day: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM('PERSONAL', 'WORK', 'FAMILY', 'SOCIAL', 'HEALTH', 'OTHER'),
        defaultValue: 'PERSONAL',
        allowNull: false
    },
    recurrence: {
        type: DataTypes.ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
        defaultValue: 'NONE',
        allowNull: false
    },
    reminder_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'calendar_events',
    timestamps: true,
    underscored: true
});

CalendarEvent.associate = (models) => {
    CalendarEvent.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = CalendarEvent;
