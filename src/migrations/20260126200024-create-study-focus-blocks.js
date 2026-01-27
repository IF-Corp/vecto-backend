'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_focus_blocks', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            session_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_focus_sessions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            block_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            block_type: {
                type: Sequelize.ENUM('STUDY', 'SHORT_BREAK', 'LONG_BREAK'),
                allowNull: false,
            },
            planned_duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            actual_duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
            skipped: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('study_focus_blocks', ['session_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_focus_blocks');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_focus_blocks_block_type";');
    },
};
