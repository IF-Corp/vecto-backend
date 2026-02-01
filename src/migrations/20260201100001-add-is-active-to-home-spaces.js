'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if column exists first
        const tableDescription = await queryInterface.describeTable('home_spaces');
        if (!tableDescription.is_active) {
            await queryInterface.addColumn('home_spaces', 'is_active', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tableDescription = await queryInterface.describeTable('home_spaces');
        if (tableDescription.is_active) {
            await queryInterface.removeColumn('home_spaces', 'is_active');
        }
    },
};
