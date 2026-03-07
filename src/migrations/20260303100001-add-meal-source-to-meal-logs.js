'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('meal_logs', 'meal_source', {
            type: Sequelize.ENUM('diet', 'free'),
            allowNull: false,
            defaultValue: 'free'
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('meal_logs', 'meal_source');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_meal_logs_meal_source";');
    }
};
