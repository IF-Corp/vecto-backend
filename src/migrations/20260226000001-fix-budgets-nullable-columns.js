'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Align database constraints with model: start_date and category should be nullable
        // The original migration created them as NOT NULL, but the model evolved to allow null
        // since budgets now use month + category_id instead of start_date + category
        await queryInterface.changeColumn('budgets', 'start_date', {
            type: Sequelize.DATEONLY,
            allowNull: true
        });

        await queryInterface.changeColumn('budgets', 'category', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('budgets', 'start_date', {
            type: Sequelize.DATEONLY,
            allowNull: false
        });

        await queryInterface.changeColumn('budgets', 'category', {
            type: Sequelize.STRING,
            allowNull: false
        });
    }
};
