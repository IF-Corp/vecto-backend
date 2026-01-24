'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add unique constraint to nickname column
        await queryInterface.addConstraint('users', {
            fields: ['nickname'],
            type: 'unique',
            name: 'users_nickname_unique'
        });

        // Create index for faster username lookups
        await queryInterface.addIndex('users', ['nickname'], {
            name: 'users_nickname_idx',
            where: {
                nickname: {
                    [Sequelize.Op.ne]: null
                }
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('users', 'users_nickname_idx');
        await queryInterface.removeConstraint('users', 'users_nickname_unique');
    }
};
