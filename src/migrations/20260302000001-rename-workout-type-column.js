'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameColumn('workouts', 'type', 'workout_type');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.renameColumn('workouts', 'workout_type', 'type');
    },
};
