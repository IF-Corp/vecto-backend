const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkSkillEvidence = sequelize.define('WorkSkillEvidence', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    skill_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    evidence_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
}, {
    tableName: 'work_skill_evidences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
});

WorkSkillEvidence.associate = (models) => {
    WorkSkillEvidence.belongsTo(models.WorkSkill, {
        foreignKey: 'skill_id',
        as: 'skill',
    });
};

module.exports = WorkSkillEvidence;
