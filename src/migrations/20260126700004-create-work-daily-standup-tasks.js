'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create standup_task_status enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE standup_task_status AS ENUM ('completed', 'in_progress', 'not_started', 'blocked', 'deferred');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_daily_standup_tasks', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            standup_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_daily_standups',
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
            custom_description: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: 'For tasks not in the system',
            },
            is_from_yesterday: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            status: {
                type: Sequelize.ENUM('completed', 'in_progress', 'not_started', 'blocked', 'deferred'),
                allowNull: false,
                defaultValue: 'not_started',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('work_daily_standup_tasks', ['standup_id']);
        await queryInterface.addIndex('work_daily_standup_tasks', ['task_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_daily_standup_tasks');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS standup_task_status;');
    },
};
