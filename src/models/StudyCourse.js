const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudyCourse = sequelize.define('StudyCourse', {
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
    name: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    institution: {
        type: DataTypes.STRING(300),
        allowNull: true,
    },
    course_type: {
        type: DataTypes.ENUM('UNDERGRADUATE', 'POSTGRADUATE', 'TECHNICAL', 'OTHER'),
        allowNull: false,
        defaultValue: 'UNDERGRADUATE',
    },
    total_periods: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    min_passing_grade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        defaultValue: 6.0,
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
}, {
    tableName: 'study_courses',
    timestamps: true,
    underscored: true,
});

StudyCourse.associate = (models) => {
    StudyCourse.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    StudyCourse.hasMany(models.StudyPeriod, {
        foreignKey: 'course_id',
        as: 'periods',
    });
};

module.exports = StudyCourse;
