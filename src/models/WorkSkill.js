const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkSkill = sequelize.define('WorkSkill', {
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
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    current_level: {
        type: DataTypes.ENUM('BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
        allowNull: false,
        defaultValue: 'BEGINNER',
    },
    target_level: {
        type: DataTypes.ENUM('BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
        allowNull: false,
        defaultValue: 'INTERMEDIATE',
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true,
    },
}, {
    tableName: 'work_skills',
    timestamps: true,
    underscored: true,
});

WorkSkill.associate = (models) => {
    WorkSkill.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    WorkSkill.hasMany(models.WorkSkillEvidence, {
        foreignKey: 'skill_id',
        as: 'evidences',
    });
    WorkSkill.hasMany(models.WorkCertification, {
        foreignKey: 'skill_id',
        as: 'certifications',
    });
};

// Skill level values for progress calculation
WorkSkill.LEVEL_VALUES = {
    BEGINNER: 1,
    BASIC: 2,
    INTERMEDIATE: 3,
    ADVANCED: 4,
    EXPERT: 5,
};

WorkSkill.calculateProgress = function(currentLevel, targetLevel) {
    const currentValue = WorkSkill.LEVEL_VALUES[currentLevel] || 1;
    const targetValue = WorkSkill.LEVEL_VALUES[targetLevel] || 5;

    if (targetValue <= currentValue) return 100;

    // Progress from level 1 to target
    const totalRange = targetValue - 1;
    const currentProgress = currentValue - 1;

    return Math.round((currentProgress / totalRange) * 100);
};

module.exports = WorkSkill;
