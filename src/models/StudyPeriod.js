const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyPeriod = sequelize.define('StudyPeriod', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'study_courses',
            key: 'id',
        },
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    target_grade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'PLANNED'),
        allowNull: false,
        defaultValue: 'PLANNED',
    },
}, {
    tableName: 'study_periods',
    timestamps: true,
    underscored: true,
});

StudyPeriod.associate = (models) => {
    StudyPeriod.belongsTo(models.StudyCourse, {
        foreignKey: 'course_id',
        as: 'course',
    });
    StudyPeriod.hasMany(models.StudySubject, {
        foreignKey: 'period_id',
        as: 'subjects',
    });
};

module.exports = StudyPeriod;
