'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_meeting_actions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            meeting_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_meetings',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            assignee: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            is_completed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            converted_task_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_tasks',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('work_meeting_actions', ['meeting_id']);
        await queryInterface.addIndex('work_meeting_actions', ['is_completed']);
        await queryInterface.addIndex('work_meeting_actions', ['due_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_meeting_actions');
    },
};
