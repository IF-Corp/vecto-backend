'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new columns to routine_items for standalone items (not linked to habits)
        await queryInterface.addColumn('routine_items', 'title', {
            type: Sequelize.STRING(200),
            allowNull: true
        });

        await queryInterface.addColumn('routine_items', 'estimated_duration', {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Duration in minutes'
        });

        // Make habit_id nullable since items can be standalone
        await queryInterface.changeColumn('routine_items', 'habit_id', {
            type: Sequelize.UUID,
            allowNull: true
        });

        // Rename execution_order to order for consistency
        await queryInterface.renameColumn('routine_items', 'execution_order', 'item_order');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.renameColumn('routine_items', 'item_order', 'execution_order');

        await queryInterface.changeColumn('routine_items', 'habit_id', {
            type: Sequelize.UUID,
            allowNull: false
        });

        await queryInterface.removeColumn('routine_items', 'estimated_duration');
        await queryInterface.removeColumn('routine_items', 'title');
    }
};
