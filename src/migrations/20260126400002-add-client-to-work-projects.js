'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add client_id to work_projects
        await queryInterface.addColumn('work_projects', 'client_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'work_clients',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // Add budget_value to work_projects
        await queryInterface.addColumn('work_projects', 'budget_value', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        });

        // Add index for client_id
        await queryInterface.addIndex('work_projects', ['client_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('work_projects', 'client_id');
        await queryInterface.removeColumn('work_projects', 'budget_value');
    },
};
