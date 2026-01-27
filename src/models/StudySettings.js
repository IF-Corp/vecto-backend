const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StudySettings = sequelize.define('StudySettings', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    // Algorithm settings
    algorithm_type: {
        type: DataTypes.ENUM('LEITNER', 'FSRS_VECTO'),
        allowNull: false,
        defaultValue: 'FSRS_VECTO',
    },
    // Grade settings
    grade_scale: {
        type: DataTypes.ENUM('0-10', '0-100', 'A-F'),
        allowNull: false,
        defaultValue: '0-10',
    },
    passing_grade: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 6,
    },
    show_score_colors: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    // Study goals
    weekly_goal_hours: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: true,
        defaultValue: 20,
    },
    daily_study_goal_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
    },
    // Focus mode settings
    default_focus_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 25,
    },
    default_break_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
    },
    // Flashcard settings (FSRS)
    default_new_cards_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20,
    },
    default_review_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 200,
    },
    fsrs_desired_retention: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.9,
    },
    // Notification settings
    notifications_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    show_streak_notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    auto_schedule_reviews: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    review_reminder_time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferred_times: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: ['morning', 'evening'],
    },
    // Streak tracking
    current_streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    longest_streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    last_study_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    // Customization
    theme_color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'study_settings',
    timestamps: true,
    underscored: true,
});

StudySettings.associate = (models) => {
    StudySettings.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = StudySettings;
