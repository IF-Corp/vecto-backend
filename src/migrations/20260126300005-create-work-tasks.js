'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create priority quadrant ENUM
        await queryInterface.sequelize.query(`
            CREATE TYPE priority_quadrant AS ENUM ('DO_NOW', 'SCHEDULE', 'DELEGATE', 'ELIMINATE');
        `).catch(() => {}); // Ignore if already exists

        await queryInterface.createTable('work_tasks', {
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
            type_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_task_types',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            status_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_task_statuses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            title: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_urgent: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_important: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            priority_quadrant: {
                type: Sequelize.ENUM('DO_NOW', 'SCHEDULE', 'DELEGATE', 'ELIMINATE'),
                allowNull: false,
                defaultValue: 'ELIMINATE',
            },
            estimated_hours: {
                type: Sequelize.DECIMAL(6, 2),
                allowNull: true,
            },
            actual_hours: {
                type: Sequelize.DECIMAL(6, 2),
                allowNull: true,
                defaultValue: 0,
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            scheduled_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            scheduled_time: {
                type: Sequelize.TIME,
                allowNull: true,
            },
            reminder_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            tags: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true,
                defaultValue: [],
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
        await queryInterface.addIndex('work_tasks', ['user_id']);
        await queryInterface.addIndex('work_tasks', ['project_id']);
        await queryInterface.addIndex('work_tasks', ['status_id']);
        await queryInterface.addIndex('work_tasks', ['priority_quadrant']);
        await queryInterface.addIndex('work_tasks', ['deadline']);
        await queryInterface.addIndex('work_tasks', ['scheduled_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_tasks');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS priority_quadrant;').catch(() => {});
    },
};
