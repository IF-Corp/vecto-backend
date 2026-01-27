'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create session_status enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE work_mode_session_status AS ENUM ('in_progress', 'paused', 'completed', 'cancelled');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_mode_sessions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
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
            mode_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_modes',
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
            status: {
                type: Sequelize.ENUM('in_progress', 'paused', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'in_progress',
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            finished_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            paused_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            planned_duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Planned duration in minutes',
            },
            actual_duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Actual duration in seconds',
            },
            paused_duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Total paused duration in seconds',
            },
            blocks_completed: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('work_mode_sessions', ['user_id']);
        await queryInterface.addIndex('work_mode_sessions', ['mode_id']);
        await queryInterface.addIndex('work_mode_sessions', ['status']);
        await queryInterface.addIndex('work_mode_sessions', ['started_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_mode_sessions');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS work_mode_session_status;');
    },
};
