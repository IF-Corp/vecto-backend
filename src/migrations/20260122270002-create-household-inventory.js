'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('household_inventory', {
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
            location: {
                type: Sequelize.STRING,
                allowNull: true
            },
            minimum_quantity: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            expiration_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            purchase_date: {
                type: Sequelize.DATEONLY,
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

        await queryInterface.addIndex('household_inventory', ['user_id']);
        await queryInterface.addIndex('household_inventory', ['category']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('household_inventory');
    }
};
