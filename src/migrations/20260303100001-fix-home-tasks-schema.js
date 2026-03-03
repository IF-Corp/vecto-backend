'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Rename 'frequency' column to 'frequency_type' to match model
        await queryInterface.renameColumn('home_tasks', 'frequency', 'frequency_type');

        // Add missing columns that exist in the model but not in the database
        await queryInterface.addColumn('home_tasks', 'room', {
            type: Sequelize.STRING(100),
            allowNull: true,
        });

        await queryInterface.addColumn('home_tasks', 'frequency_value', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn('home_tasks', 'specific_days', {
            type: Sequelize.JSONB,
            allowNull: true,
        });

        await queryInterface.addColumn('home_tasks', 'is_rotation', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.addColumn('home_tasks', 'preferred_time', {
            type: Sequelize.STRING(50),
            allowNull: true,
        });

        await queryInterface.addColumn('home_tasks', 'current_streak', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('home_tasks', 'best_streak', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('home_tasks', 'best_streak');
        await queryInterface.removeColumn('home_tasks', 'current_streak');
        await queryInterface.removeColumn('home_tasks', 'preferred_time');
        await queryInterface.removeColumn('home_tasks', 'is_rotation');
        await queryInterface.removeColumn('home_tasks', 'specific_days');
        await queryInterface.removeColumn('home_tasks', 'frequency_value');
        await queryInterface.removeColumn('home_tasks', 'room');
        await queryInterface.renameColumn('home_tasks', 'frequency_type', 'frequency');
    },
};
