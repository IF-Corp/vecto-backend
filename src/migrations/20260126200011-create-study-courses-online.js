'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_courses_online', {
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
            name: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            platform: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            instructor: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            modality: {
                type: Sequelize.ENUM('ONLINE', 'IN_PERSON', 'HYBRID'),
                allowNull: false,
                defaultValue: 'ONLINE',
            },
            category: {
                type: Sequelize.ENUM('EXTRACURRICULAR', 'CERTIFICATION', 'EXTENSION', 'FREE'),
                allowNull: false,
                defaultValue: 'EXTRACURRICULAR',
            },
            total_lessons: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            current_lesson: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            total_hours: {
                type: Sequelize.DECIMAL(6, 1),
                allowNull: true,
            },
            cover_url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'),
                allowNull: false,
                defaultValue: 'NOT_STARTED',
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            started_at: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            finished_at: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            certificate_url: {
                type: Sequelize.STRING(500),
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

        await queryInterface.addIndex('study_courses_online', ['user_id']);
        await queryInterface.addIndex('study_courses_online', ['status']);
        await queryInterface.addIndex('study_courses_online', ['category']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_courses_online');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_courses_online_modality";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_courses_online_category";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_courses_online_status";');
    },
};
