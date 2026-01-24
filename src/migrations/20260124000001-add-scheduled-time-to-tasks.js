'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('tasks', 'scheduled_time', {
            type: Sequelize.TIME,
            allowNull: true
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('tasks', 'scheduled_time');
    }
};
