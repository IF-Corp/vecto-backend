'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create period type enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE okr_period_type AS ENUM ('QUARTERLY', 'SEMESTER', 'YEARLY', 'CUSTOM');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create area enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE okr_area AS ENUM ('CAREER', 'PROJECT', 'COMPANY', 'PERSONAL');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create status enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE okr_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_objectives', {
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
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            period_type: {
                type: Sequelize.ENUM('QUARTERLY', 'SEMESTER', 'YEARLY', 'CUSTOM'),
                allowNull: false,
                defaultValue: 'QUARTERLY',
            },
            period_start: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            period_end: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            area: {
                type: Sequelize.ENUM('CAREER', 'PROJECT', 'COMPANY', 'PERSONAL'),
                allowNull: false,
                defaultValue: 'CAREER',
            },
            status: {
                type: Sequelize.ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'DRAFT',
            },
            progress: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('work_objectives', ['user_id']);
        await queryInterface.addIndex('work_objectives', ['status']);
        await queryInterface.addIndex('work_objectives', ['period_start', 'period_end']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_objectives');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS okr_period_type;');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS okr_area;');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS okr_status;');
    },
};
