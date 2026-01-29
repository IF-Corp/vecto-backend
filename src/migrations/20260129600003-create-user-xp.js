'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_xp', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            total_xp: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            current_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
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

        await queryInterface.addIndex('user_xp', ['user_id']);
        await queryInterface.addIndex('user_xp', ['total_xp']);
        await queryInterface.addIndex('user_xp', ['current_level']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_xp');
    }
};
