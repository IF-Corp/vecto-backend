'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('tasks', 'completed_at', {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });

        // Backfill: set completed_at for existing DONE tasks using updated_at as approximation
        await queryInterface.sequelize.query(
            `UPDATE tasks SET completed_at = DATE(updated_at) WHERE status = 'DONE'`
        );
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('tasks', 'completed_at');
    },
};
