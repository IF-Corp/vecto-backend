'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_shopping_items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            list_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_shopping_lists',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            unit: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            estimated_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            is_purchased: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            purchased_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            added_by_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('home_shopping_items', ['list_id']);
        await queryInterface.addIndex('home_shopping_items', ['added_by_member_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_shopping_items');
    },
};
