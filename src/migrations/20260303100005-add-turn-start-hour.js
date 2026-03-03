'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('dashboard_settings', 'turn_start_hour', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 7,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('dashboard_settings', 'turn_start_hour');
    },
};
