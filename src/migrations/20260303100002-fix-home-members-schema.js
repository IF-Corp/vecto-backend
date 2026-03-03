'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Rename 'profile' column to 'profile_type' to match model
        await queryInterface.renameColumn('home_members', 'profile', 'profile_type');

        // Add missing columns that exist in the model but not in the database
        await queryInterface.addColumn('home_members', 'linked_user_id', {
            type: Sequelize.UUID,
            allowNull: true,
        });

        await queryInterface.addColumn('home_members', 'participates_tasks', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        await queryInterface.addColumn('home_members', 'participates_costs', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        await queryInterface.addColumn('home_members', 'task_percentage', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn('home_members', 'is_admin', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('home_members', 'is_admin');
        await queryInterface.removeColumn('home_members', 'task_percentage');
        await queryInterface.removeColumn('home_members', 'participates_costs');
        await queryInterface.removeColumn('home_members', 'participates_tasks');
        await queryInterface.removeColumn('home_members', 'linked_user_id');
        await queryInterface.renameColumn('home_members', 'profile_type', 'profile');
    },
};
