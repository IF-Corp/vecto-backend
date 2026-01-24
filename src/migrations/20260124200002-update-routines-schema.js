'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new columns to routines table
        await queryInterface.addColumn('routines', 'best_streak', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });

        await queryInterface.addColumn('routines', 'status', {
            type: Sequelize.ENUM('active', 'archived'),
            defaultValue: 'active',
            allowNull: false
        });

        await queryInterface.addColumn('routines', 'average_duration', {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Average execution duration in seconds'
        });

        // Add index for status filtering
        await queryInterface.addIndex('routines', ['user_id', 'status'], {
            name: 'routines_user_status_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('routines', 'routines_user_status_idx');
        await queryInterface.removeColumn('routines', 'average_duration');
        await queryInterface.removeColumn('routines', 'status');
        await queryInterface.removeColumn('routines', 'best_streak');

        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_routines_status";');
    }
};
