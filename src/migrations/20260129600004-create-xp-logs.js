'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create xp_source enum
        await queryInterface.sequelize.query(`
            CREATE TYPE xp_source AS ENUM (
                'HABIT_COMPLETE',
                'TASK_COMPLETE',
                'STREAK_BONUS',
                'ACHIEVEMENT',
                'BUDGET_KEPT',
                'STUDY_SESSION',
                'WORKOUT_COMPLETE',
                'FOCUS_SESSION',
                'DAILY_LOGIN',
                'LEVEL_UP_BONUS',
                'OTHER'
            );
        `);

        await queryInterface.createTable('xp_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            xp_amount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            source: {
                type: 'xp_source',
                allowNull: false
            },
            source_id: {
                type: Sequelize.UUID,
                allowNull: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addIndex('xp_logs', ['user_id']);
        await queryInterface.addIndex('xp_logs', ['source']);
        await queryInterface.addIndex('xp_logs', ['created_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('xp_logs');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS xp_source;');
    }
};
