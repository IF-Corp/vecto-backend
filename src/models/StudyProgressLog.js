const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyProgressLog = sequelize.define('StudyProgressLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    resource_type: {
        type: DataTypes.ENUM('BOOK', 'COURSE_ONLINE'),
        allowNull: false,
    },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    progress_from: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    progress_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_spent_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'study_progress_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

StudyProgressLog.associate = (models) => {
    StudyProgressLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = StudyProgressLog;
