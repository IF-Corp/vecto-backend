const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudySession = sequelize.define('StudySession', {
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
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    technique: {
        type: DataTypes.ENUM('POMODORO', 'DEEP_WORK', 'ACTIVE_RECALL', 'FREE_STUDY', 'OTHER'),
        allowNull: true
    },
    productivity_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'study_sessions',
    timestamps: true,
    underscored: true
});

StudySession.associate = (models) => {
    StudySession.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = StudySession;
