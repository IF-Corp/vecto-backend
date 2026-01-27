'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create ENUM types first
        await queryInterface.sequelize.query(`
            CREATE TYPE work_type AS ENUM ('CLT', 'PJ', 'FREELANCER', 'ENTREPRENEUR', 'HYBRID');
        `).catch(() => {}); // Ignore if already exists

        await queryInterface.sequelize.query(`
            CREATE TYPE work_model AS ENUM ('IN_PERSON', 'REMOTE', 'HYBRID');
        `).catch(() => {}); // Ignore if already exists

        await queryInterface.createTable('work_profiles', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            work_type: {
                type: Sequelize.ENUM('CLT', 'PJ', 'FREELANCER', 'ENTREPRENEUR', 'HYBRID'),
                allowNull: false,
                defaultValue: 'CLT',
            },
            work_model: {
                type: Sequelize.ENUM('IN_PERSON', 'REMOTE', 'HYBRID'),
                allowNull: false,
                defaultValue: 'HYBRID',
            },
            weekly_hours: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 40,
            },
            overtime_limit: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
            has_external_clients: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            week_start_day: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1, // 0 = Sunday, 1 = Monday
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_profiles');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS work_type;').catch(() => {});
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS work_model;').catch(() => {});
    },
};
