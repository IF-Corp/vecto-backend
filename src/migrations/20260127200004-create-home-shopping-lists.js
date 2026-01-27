'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_shopping_lists', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            space_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            icon: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_recurring: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            reset_day: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            created_by_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            is_completed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('home_shopping_lists', ['space_id']);
        await queryInterface.addIndex('home_shopping_lists', ['created_by_member_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_shopping_lists');
    },
};
