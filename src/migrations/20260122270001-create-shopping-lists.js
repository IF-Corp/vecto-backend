'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shopping_lists', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            unit: {
                type: Sequelize.STRING,
                allowNull: true
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_purchased: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            priority: {
                type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
                defaultValue: 'MEDIUM',
                allowNull: false
            },
            estimated_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
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

        await queryInterface.addIndex('shopping_lists', ['user_id']);
        await queryInterface.addIndex('shopping_lists', ['is_purchased']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('shopping_lists');
    }
};
