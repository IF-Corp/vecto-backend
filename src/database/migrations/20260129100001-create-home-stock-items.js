'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('home_stock_items', {
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
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            category: {
                type: Sequelize.ENUM('FOOD', 'CLEANING', 'HYGIENE', 'PET', 'OTHER'),
                allowNull: false,
                defaultValue: 'OTHER',
            },
            current_quantity: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            min_quantity: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 1,
            },
            unit: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            expiry_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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

        await queryInterface.addIndex('home_stock_items', ['space_id']);
        await queryInterface.addIndex('home_stock_items', ['category']);
        await queryInterface.addIndex('home_stock_items', ['expiry_date']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_stock_items');
    },
};
