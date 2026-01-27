'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_maintenances', {
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
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            frequency_type: {
                type: Sequelize.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'),
                allowNull: false,
            },
            frequency_value: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            last_done_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            next_due_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            estimated_cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            reminder_days_before: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 3,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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

        await queryInterface.addIndex('home_maintenances', ['space_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_maintenances');
    },
};
