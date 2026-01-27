'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_flashcards', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            deck_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_decks',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            front: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            back: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            difficulty: {
                type: Sequelize.ENUM('NEW', 'LEARNING', 'REVIEW', 'RELEARNING'),
                allowNull: false,
                defaultValue: 'NEW',
            },
            next_review_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            interval_days: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0,
            },
            ease_factor: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: true,
                defaultValue: 2.5,
            },
            review_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            lapses: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            stability: {
                type: Sequelize.DECIMAL(10, 4),
                allowNull: true,
            },
            retrievability: {
                type: Sequelize.DECIMAL(5, 4),
                allowNull: true,
            },
            last_review_at: {
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

        await queryInterface.addIndex('study_flashcards', ['deck_id']);
        await queryInterface.addIndex('study_flashcards', ['next_review_at']);
        await queryInterface.addIndex('study_flashcards', ['difficulty']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_flashcards');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_flashcards_difficulty";');
    },
};
