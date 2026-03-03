'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableDescription = await queryInterface.describeTable('home_shopping_items');

        if (!tableDescription.category) {
            await queryInterface.addColumn('home_shopping_items', 'category', {
                type: Sequelize.STRING(50),
                allowNull: true,
            });
        }

        if (!tableDescription.notes) {
            await queryInterface.addColumn('home_shopping_items', 'notes', {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('home_shopping_items', 'category');
        await queryInterface.removeColumn('home_shopping_items', 'notes');
    },
};
