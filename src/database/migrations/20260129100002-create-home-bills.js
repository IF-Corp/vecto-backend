'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('home_bills', {
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
                type: Sequelize.ENUM(
                    'RENT',
                    'CONDO',
                    'ELECTRICITY',
                    'WATER',
                    'GAS',
                    'INTERNET',
                    'PHONE',
                    'STREAMING',
                    'INSURANCE',
                    'OTHER'
                ),
                allowNull: false,
                defaultValue: 'OTHER',
            },
            average_amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            due_day: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 31,
                },
            },
            reminder_days_before: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 3,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        await queryInterface.addIndex('home_bills', ['space_id']);
        await queryInterface.addIndex('home_bills', ['category']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_bills');
    },
};
