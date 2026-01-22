'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'password_hash', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('users', 'birth_date', {
            type: Sequelize.DATEONLY,
            allowNull: true
        });

        await queryInterface.addColumn('users', 'avatar_url', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'password_hash');
        await queryInterface.removeColumn('users', 'birth_date');
        await queryInterface.removeColumn('users', 'avatar_url');
    }
};
