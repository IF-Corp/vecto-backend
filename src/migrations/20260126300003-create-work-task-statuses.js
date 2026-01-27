'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_task_statuses', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: true, // null for system defaults
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            color: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: '#64748b',
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_done_status: {
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

        // Add index for user_id
        await queryInterface.addIndex('work_task_statuses', ['user_id']);

        // Seed default statuses
        await queryInterface.bulkInsert('work_task_statuses', [
            {
                id: 'c0000000-0000-0000-0000-000000000001',
                user_id: null,
                name: 'To Do',
                color: '#64748b',
                order: 1,
                is_default: true,
                is_done_status: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c0000000-0000-0000-0000-000000000002',
                user_id: null,
                name: 'In Progress',
                color: '#3b82f6',
                order: 2,
                is_default: true,
                is_done_status: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c0000000-0000-0000-0000-000000000003',
                user_id: null,
                name: 'In Review',
                color: '#8b5cf6',
                order: 3,
                is_default: true,
                is_done_status: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c0000000-0000-0000-0000-000000000004',
                user_id: null,
                name: 'Done',
                color: '#22c55e',
                order: 4,
                is_default: true,
                is_done_status: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_task_statuses');
    },
};
