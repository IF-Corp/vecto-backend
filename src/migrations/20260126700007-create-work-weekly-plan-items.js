'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_weekly_plan_items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            plan_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_weekly_plans',
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
            custom_title: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: 'For items not linked to a task',
            },
            priority_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            target_day: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            estimated_hours: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: true,
            },
            is_completed: {
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

        await queryInterface.addIndex('work_weekly_plan_items', ['plan_id']);
        await queryInterface.addIndex('work_weekly_plan_items', ['task_id']);
        await queryInterface.addIndex('work_weekly_plan_items', ['priority_order']);
        await queryInterface.addIndex('work_weekly_plan_items', ['target_day']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_weekly_plan_items');
    },
};
