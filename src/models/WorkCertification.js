const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkCertification = sequelize.define('WorkCertification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    issuer: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    obtained_at: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    credential_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    credential_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    skill_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    tableName: 'work_certifications',
    timestamps: true,
    underscored: true,
});

WorkCertification.associate = (models) => {
    WorkCertification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkCertification.belongsTo(models.WorkSkill, {
        foreignKey: 'skill_id',
        as: 'skill',
    });
};

module.exports = WorkCertification;
