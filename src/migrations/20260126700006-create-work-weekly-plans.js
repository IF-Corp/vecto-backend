'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create weekly_plan_status enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE weekly_plan_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_weekly_plans', {
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
            week_start: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            week_end: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            available_hours: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 40,
            },
            meeting_hours: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            },
            work_hours: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                comment: 'Available hours - meeting hours',
            },
            estimated_hours: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                comment: 'Total estimated hours for planned tasks',
            },
            actual_hours: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                comment: 'Actual hours worked at end of week',
            },
            status: {
                type: Sequelize.ENUM('draft', 'active', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'draft',
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

        await queryInterface.addIndex('work_weekly_plans', ['user_id', 'week_start'], { unique: true });
        await queryInterface.addIndex('work_weekly_plans', ['week_start']);
        await queryInterface.addIndex('work_weekly_plans', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_weekly_plans');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS weekly_plan_status;');
    },
};
