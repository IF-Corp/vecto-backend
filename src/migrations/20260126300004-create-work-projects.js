'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_projects', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            client: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: '#6366f1',
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            budget_hours: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            hourly_rate: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            is_billable: {
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

        // Add indexes
        await queryInterface.addIndex('work_projects', ['user_id']);
        await queryInterface.addIndex('work_projects', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_projects');
    },
};
