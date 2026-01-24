'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new columns to habits table
        await queryInterface.addColumn('habits', 'category', {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'Geral'
        });

        await queryInterface.addColumn('habits', 'description', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('habits', 'time_period', {
            type: Sequelize.ENUM('morning', 'afternoon', 'evening', 'anytime'),
            allowNull: true,
            defaultValue: 'anytime'
        });

        await queryInterface.addColumn('habits', 'estimated_duration', {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Duration in minutes'
        });

        await queryInterface.addColumn('habits', 'best_streak', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });

        await queryInterface.addColumn('habits', 'status', {
            type: Sequelize.ENUM('active', 'archived'),
            defaultValue: 'active',
            allowNull: false
        });

        // Add index for status filtering
        await queryInterface.addIndex('habits', ['user_id', 'status'], {
            name: 'habits_user_status_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('habits', 'habits_user_status_idx');
        await queryInterface.removeColumn('habits', 'status');
        await queryInterface.removeColumn('habits', 'best_streak');
        await queryInterface.removeColumn('habits', 'estimated_duration');
        await queryInterface.removeColumn('habits', 'time_period');
        await queryInterface.removeColumn('habits', 'description');
        await queryInterface.removeColumn('habits', 'category');

        // Drop ENUMs
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_habits_time_period";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_habits_status";');
    }
};
