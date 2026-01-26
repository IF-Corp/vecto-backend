'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add category_id column
        await queryInterface.addColumn('budgets', 'category_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'finance_categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add month column
        await queryInterface.addColumn('budgets', 'month', {
            type: Sequelize.DATEONLY,
            allowNull: true
        });

        // Add index
        await queryInterface.addIndex('budgets', ['user_id', 'month'], {
            name: 'budgets_user_month_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('budgets', 'budgets_user_month_idx');
        await queryInterface.removeColumn('budgets', 'category_id');
        await queryInterface.removeColumn('budgets', 'month');
    }
};
