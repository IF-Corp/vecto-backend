'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add status column with enum
        await queryInterface.addColumn('routine_executions', 'status', {
            type: Sequelize.ENUM('in_progress', 'paused', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'completed'
        });

        // Add paused_duration column (accumulated pause time in seconds)
        await queryInterface.addColumn('routine_executions', 'paused_duration', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });

        // Add paused_at column (timestamp when paused, null if not paused)
        await queryInterface.addColumn('routine_executions', 'paused_at', {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        });

        // Add index for finding active sessions by user
        await queryInterface.addIndex('routine_executions', ['status'], {
            name: 'routine_executions_status_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('routine_executions', 'routine_executions_status_idx');
        await queryInterface.removeColumn('routine_executions', 'paused_at');
        await queryInterface.removeColumn('routine_executions', 'paused_duration');
        await queryInterface.removeColumn('routine_executions', 'status');

        // Drop the enum type
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_routine_executions_status";');
    }
};
