'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_focus_sessions', {
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
            preset_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_focus_presets',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            topic_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_topics',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            subject_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_subjects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            custom_block_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            custom_break_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            planned_blocks: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            completed_blocks: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_focus_minutes: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_break_minutes: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            skipped_breaks: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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
            status: {
                type: Sequelize.ENUM('IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'IN_PROGRESS',
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

        await queryInterface.addIndex('study_focus_sessions', ['user_id']);
        await queryInterface.addIndex('study_focus_sessions', ['status']);
        await queryInterface.addIndex('study_focus_sessions', ['started_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_focus_sessions');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_focus_sessions_status";');
    },
};
