'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_time_entries', {
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
            task_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_tasks',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            ended_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            is_billable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            is_running: {
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

        // Add indexes
        await queryInterface.addIndex('work_time_entries', ['user_id']);
        await queryInterface.addIndex('work_time_entries', ['task_id']);
        await queryInterface.addIndex('work_time_entries', ['project_id']);
        await queryInterface.addIndex('work_time_entries', ['started_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_time_entries');
    },
};
