'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if column exists before adding
        const tableInfo = await queryInterface.describeTable('home_task_occurrences');

        if (!tableInfo.status) {
            // Create the ENUM type first
            await queryInterface.sequelize.query(`
                DO $$ BEGIN
                    CREATE TYPE enum_home_task_occurrences_status AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
            `);

            await queryInterface.addColumn('home_task_occurrences', 'status', {
                type: Sequelize.ENUM('PENDING', 'COMPLETED', 'SKIPPED'),
                allowNull: false,
                defaultValue: 'PENDING',
            });
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('home_task_occurrences', 'status');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_home_task_occurrences_status;');
    },
};
