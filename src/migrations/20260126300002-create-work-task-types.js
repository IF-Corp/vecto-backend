'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_task_types', {
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
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 'circle',
            },
            color: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: '#6366f1',
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

        // Add index for user_id
        await queryInterface.addIndex('work_task_types', ['user_id']);

        // Seed default task types
        await queryInterface.bulkInsert('work_task_types', [
            {
                id: 'b0000000-0000-0000-0000-000000000001',
                user_id: null,
                name: 'Entrega',
                icon: 'package',
                color: '#22c55e',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000002',
                user_id: null,
                name: 'Reunião',
                icon: 'users',
                color: '#3b82f6',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000003',
                user_id: null,
                name: 'Comunicação',
                icon: 'message-circle',
                color: '#8b5cf6',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000004',
                user_id: null,
                name: 'Análise',
                icon: 'bar-chart-2',
                color: '#06b6d4',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000005',
                user_id: null,
                name: 'Operacional',
                icon: 'settings',
                color: '#64748b',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000006',
                user_id: null,
                name: 'Criativo',
                icon: 'lightbulb',
                color: '#f59e0b',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000007',
                user_id: null,
                name: 'Suporte',
                icon: 'wrench',
                color: '#ef4444',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000008',
                user_id: null,
                name: 'Aprendizado',
                icon: 'book-open',
                color: '#ec4899',
                is_default: true,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_task_types');
    },
};
