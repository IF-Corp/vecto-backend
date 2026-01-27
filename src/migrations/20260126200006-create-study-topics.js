'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_topics', {
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
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            difficulty: {
                type: Sequelize.ENUM('EASY', 'MEDIUM', 'HARD', 'VERY_HARD'),
                allowNull: true,
            },
            retention_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            parent_type: {
                type: Sequelize.ENUM('SUBJECT', 'BOOK', 'COURSE_ONLINE', 'PROJECT'),
                allowNull: true,
            },
            parent_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('TO_LEARN', 'IN_PROGRESS', 'NEEDS_REVIEW', 'MASTERED'),
                allowNull: false,
                defaultValue: 'TO_LEARN',
            },
            last_reviewed_at: {
                type: Sequelize.DATE,
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

        await queryInterface.addIndex('study_topics', ['user_id']);
        await queryInterface.addIndex('study_topics', ['parent_type', 'parent_id']);
        await queryInterface.addIndex('study_topics', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_topics');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_topics_difficulty";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_topics_parent_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_topics_status";');
    },
};
