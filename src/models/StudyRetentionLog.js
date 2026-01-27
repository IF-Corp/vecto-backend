const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyRetentionLog = sequelize.define('StudyRetentionLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    topic_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_topics',
            key: 'id',
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    evaluated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'study_retention_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

StudyRetentionLog.associate = (models) => {
    StudyRetentionLog.belongsTo(models.StudyTopic, {
        foreignKey: 'topic_id',
        as: 'topic',
    });
};

module.exports = StudyRetentionLog;
