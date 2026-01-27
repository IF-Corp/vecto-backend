'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new columns to study_settings table
        await queryInterface.addColumn('study_settings', 'grade_scale', {
            type: Sequelize.ENUM('0-10', '0-100', 'A-F'),
            allowNull: false,
            defaultValue: '0-10',
        });

        await queryInterface.addColumn('study_settings', 'passing_grade', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 6,
        });

        await queryInterface.addColumn('study_settings', 'daily_study_goal_minutes', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 60,
        });

        await queryInterface.addColumn('study_settings', 'default_focus_minutes', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 25,
        });

        await queryInterface.addColumn('study_settings', 'default_break_minutes', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 5,
        });

        await queryInterface.addColumn('study_settings', 'default_new_cards_per_day', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 20,
        });

        await queryInterface.addColumn('study_settings', 'default_review_limit', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 200,
        });

        await queryInterface.addColumn('study_settings', 'fsrs_desired_retention', {
            type: Sequelize.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.9,
        });

        await queryInterface.addColumn('study_settings', 'show_score_colors', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        await queryInterface.addColumn('study_settings', 'show_streak_notifications', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        await queryInterface.addColumn('study_settings', 'auto_schedule_reviews', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        await queryInterface.addColumn('study_settings', 'review_reminder_time', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('study_settings', 'theme_color', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('study_settings', 'current_streak', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('study_settings', 'longest_streak', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('study_settings', 'last_study_date', {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('study_settings', 'grade_scale');
        await queryInterface.removeColumn('study_settings', 'passing_grade');
        await queryInterface.removeColumn('study_settings', 'daily_study_goal_minutes');
        await queryInterface.removeColumn('study_settings', 'default_focus_minutes');
        await queryInterface.removeColumn('study_settings', 'default_break_minutes');
        await queryInterface.removeColumn('study_settings', 'default_new_cards_per_day');
        await queryInterface.removeColumn('study_settings', 'default_review_limit');
        await queryInterface.removeColumn('study_settings', 'fsrs_desired_retention');
        await queryInterface.removeColumn('study_settings', 'show_score_colors');
        await queryInterface.removeColumn('study_settings', 'show_streak_notifications');
        await queryInterface.removeColumn('study_settings', 'auto_schedule_reviews');
        await queryInterface.removeColumn('study_settings', 'review_reminder_time');
        await queryInterface.removeColumn('study_settings', 'theme_color');
        await queryInterface.removeColumn('study_settings', 'current_streak');
        await queryInterface.removeColumn('study_settings', 'longest_streak');
        await queryInterface.removeColumn('study_settings', 'last_study_date');

        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_settings_grade_scale";');
    },
};
