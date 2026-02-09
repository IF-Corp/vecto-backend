'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'nickname', {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'name'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'nickname');
    }
};
