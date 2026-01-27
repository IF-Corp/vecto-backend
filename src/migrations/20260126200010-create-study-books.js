'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_books', {
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
            title: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING(300),
                allowNull: true,
            },
            total_pages: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            current_page: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            format: {
                type: Sequelize.ENUM('PHYSICAL', 'KINDLE', 'PDF', 'AUDIOBOOK_ONLY'),
                allowNull: false,
                defaultValue: 'PHYSICAL',
            },
            has_audiobook: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            cover_url: {
                type: Sequelize.STRING(500),
                allowNull: true,
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

        await queryInterface.addIndex('study_books', ['user_id']);
        await queryInterface.addIndex('study_books', ['subject_id']);
        await queryInterface.addIndex('study_books', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_books');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_books_format";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_books_status";');
    },
};
