'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('social_groups', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ranking_logic: {
                type: Sequelize.ENUM('POINTS', 'STREAK'),
                defaultValue: 'POINTS',
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('social_groups');
    }
};
