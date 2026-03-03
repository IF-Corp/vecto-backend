'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add missing columns that exist in the model but not in the database
        await queryInterface.addColumn('home_stock_items', 'notes', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        await queryInterface.addColumn('home_stock_items', 'is_active', {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('home_stock_items', 'is_active');
        await queryInterface.removeColumn('home_stock_items', 'notes');
    },
};
